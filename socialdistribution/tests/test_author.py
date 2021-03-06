from rest_framework.test import APITestCase
from django.test import TestCase
from socialdistribution.models import Author
import base64

class AuthorTests(APITestCase):
    url = "/service/author/"
    login_url = url + "login/"
    data = {"email":"test@gmail.com", "password":"pass", "username":"Alice", "github":""}
    auth_str = base64.b64encode(b'socialdistribution_t18:c404t18').decode()
    
    def test_create_account(self):
        # new account
        self.client.credentials(HTTP_AUTHORIZATION='Basic {}'.format(self.auth_str))
        response = self.client.post(self.url, data=self.data)
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response.data['authorID'])
        self.assertEqual(Author.objects.count(), 1)

        # try to create account that already exists
        response = self.client.post(self.url, self.data, HTTP_AUTHORIZATION='Basic {}'.format(self.auth_str))
        self.assertEqual(response.status_code, 422)
        self.assertEqual(Author.objects.count(), 1)
    
    def test_get_all_authors(self):
        # create two authors
        data2 = {"email":"test2@gmail.com", "password":"pass", "username":"Bob", "github":""}
        self.client.credentials(HTTP_AUTHORIZATION='Basic {}'.format(self.auth_str))
        self.client.post(self.url, self.data)
        self.client.post(self.url, data2)
        response = self.client.get(self.url)
        self.assertEqual(len(response.data), 2)
        # authors are sorted by display name
        self.assertEqual(response.data[0]["displayName"], "Alice")
        self.assertEqual(response.data[1]["displayName"], "Bob")

    def test_get_specific_author(self):
        self.client.credentials(HTTP_AUTHORIZATION='Basic {}'.format(self.auth_str))
        response = self.client.post(self.url, self.data) # create an author
        authorID = response.data["authorID"]
        author_detail_url = self.url + authorID + "/"
        response_from_get = self.client.get(author_detail_url) # get author
        self.assertEqual(response_from_get.data["displayName"], "Alice")

    def test_get_author_404(self):
        invalid_url = self.url + "d4dd49a6768c4d00039f081b4e111159/"
        self.client.credentials(HTTP_AUTHORIZATION='Basic {}'.format(self.auth_str))
        response = self.client.get(invalid_url)
        self.assertEqual(response.status_code, 404)

    def test_update_author(self):
        self.client.credentials(HTTP_AUTHORIZATION='Basic {}'.format(self.auth_str))
        response = self.client.post(self.url, self.data) # create an author
        authorID = response.data["authorID"]
        author_detail_url = self.url + authorID + "/"

        # update username and github url
        self.client.post(author_detail_url, {"username":"New Name", "github":"http://github.com"})
        response_from_get = self.client.get(author_detail_url)
        self.assertEqual(response_from_get.data["displayName"], "New Name")
        self.assertEqual(response_from_get.data["github"], "http://github.com")

        # invalid authorID
        authorID = authorID.upper()
        author_detail_url = self.url + authorID + "/"
        response = self.client.post(author_detail_url, {"email":"123@gmail.com"})
        self.assertEqual(response.status_code, 404)


class AuthorModelTests(TestCase):
    def test_allow_multiple_authors(self):
        Author.objects.create(email="123@gmail.com", password="123", username="Alice", github="")
        Author.objects.create(email="321@gmail.com", password="123", username="Bob", github="")
        self.assertEqual(Author.objects.count(), 2)

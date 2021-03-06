CMPUT404-project-socialdistribution
===================================

CMPUT404-project-socialdistribution

See project.org (plain-text/org-mode) for a description of the project.

Make a distributed social network!

## Heroku Deployed App - https://cmput-404-socialdistribution.herokuapp.com/

## Documentation
[API Documentation](https://app.swaggerhub.com/apis-docs/lida9/SocialDistribution/1.0.0-oas3)

## Basic Authentication
username: socialdistribution_t18  
password: c404t18  

## Admin account
https://cmput-404-socialdistribution.herokuapp.com/admin/  
email: team18@admin.com  
password: team18

## Running frontend
```
# install dependencies
npm install

# run app
npm start
```

## Running backend
```
# install dependencies
pip3 install -r requirements.txt

# run backend
python3 manage.py runserver
```

## Running Tests
Run all backend tests  
`python3 manage.py test socialdistribution.tests`

Run the tests in a file  
`python3 manage.py test socialdistribution.tests.file_name`

Contributors / Licensing
========================

Generally everything is LICENSE'D under the Apache 2 license by Abram Hindle.

All text is licensed under the CC-BY-SA 4.0 http://creativecommons.org/licenses/by-sa/4.0/deed.en_US

Contributors:

    Karim Baaba
    Ali Sajedi
    Kyle Richelhoff
    Chris Pavlicek
    Derek Dowling
    Olexiy Berjanskii
    Erin Torbiak
    Abram Hindle
    Braedy Kuzma

# References

How to store secret key  
https://stackoverflow.com/a/61437799/13544994

Get hex only uuid  
https://stackoverflow.com/a/48438640/13544994

Pagination  
https://www.django-rest-framework.org/api-guide/pagination/

Redux localStorage(Prevent loss on refresh)  
https://stackoverflow.com/a/45857898/9222182

Get and verify username and password from HTTP_AUTHORIZATION header  
https://stackoverflow.com/a/46428523/13544994

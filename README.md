# Schedule Your Days Off Work (example Angular app)

This demo is meant to show off various technologies. It is a bit over-engineered and has a larger footprint than  necessary, but offers a wide variety of functionality for the user.   

Example: https://dev.ericchristenson.com

### Architecture
* [Angular 18](https://angular.dev/overview)
* [PrimeNG](https://www.primefaces.org/primeng/) UI components
* Modified version of [Skeleton CSS](http://getskeleton.com/) framework
* [date-fns](https://date-fns.org/) for date handling and localization

### Functionality
* Day off scheduling
  * Interactive calendar UX
  * Ability to both add and remove days off simultaneously
  * Options deliberately limited by other schedules (such as office hours)
* API utilization (mocked)
* Full CRUD behavior 
* Multi-language support
  * Ability to change the language on the fly
  * JSON-based tokenized text
  * Localized dates and times

### Testing
Unit tests use the [Cypress](https://www.cypress.io/) test suite. 

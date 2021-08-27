# Example Days Off App in Angular

This demo is meant to show off various technologies. It is a bit over-engineered and has a larger footprint than  necessary, but offers a wide variety of functionality for the user.   

Example: http://dev.ericchristenson.com

### Architecture
* [Angular 12](https://angular.io/docs)
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
Specs are written for both [Karma](https://karma-runner.github.io/) and [Cypress](https://www.cypress.io/) test suites. 

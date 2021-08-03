# Example Days Off App in Angular

This demo is meant to show off various technologies. It is a bit over-engineered and has a larger footprint than  necessary, but offers a wide variety of functionality for the user.   

Site: http://dev.ericchristenson.com/

### Architecture
* [Angular 12](https://angular.io/docs)
* [PrimeNG](https://www.primefaces.org/primeng/) UI components
* Modified version of [Skeleton](http://getskeleton.com/) CSS framework
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

### Specs
Note that some components use `delay()` to fake API response time. The specs assume that the components are configured normally, so all `delay()` calls need to be commented out before running `ng test`. 

import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'formGroupType',
  standalone: true,
})
export class FormGroupTypePipe implements PipeTransform {
  /**
   * Types an AbstractControl as a FormGroup.
   *
   * In a template, reactive forms do not retain their typing when using a getter. Instead, they default to the
   * "AbstractControl" type. This can cause issues while working with FormGroups that include FormArrays or
   * other inner FormGroups.
   *
   * @example
   * In the component:
   *     this.form = new FormGroup({
   *         name: new FormControl('Alice'),
   *         checkbox: new FormGroup({})
   *     });
   *
   *     this.checkboxData.forEach((checkbox) => {
   *         this.form.get('checkbox').addControl(checkbox.display, new FormControl(checkbox.value));
   *     });
   *
   * In the template:
   *   <input type="text" formControlName="name">
   *   <section [formGroup]="form.get('checkbox') | formGroupType">
   */
  transform(abstractControl: AbstractControl): FormGroup {
    return abstractControl as FormGroup;
  }
}

@Pipe({
  name: 'formControlType',
  standalone: true,
})
export class FormControlTypePipe implements PipeTransform {
  /**
   * Types an AbstractControl as a FormControl.
   *
   * In a template, reactive forms do not retain their typing when using a getter. Instead, they default to the
   * "AbstractControl" type. This can cause issues while working with FormGroups that include FormArrays or
   * other inner FormGroups.
   *
   * @example
   * In the component:
   *     this.form = new FormGroup({
   *         name: new FormControl('Alice'),
   *         options: new FormArray([])
   *     });
   *
   * In the template:
   *   <input type="text" formControlName="name">
   *   <section *ngFor="let options of form.get('options').controls">
   *       <input type="checkbox" [formControl]="options | formControlType">
   *   </section>
   */
  transform(abstractControl: AbstractControl): FormControl {
    return abstractControl as FormControl;
  }
}

@Pipe({
  name: 'formKeys',
  standalone: true,
})
export class FormKeysPipe implements PipeTransform {
  /**
   * Returns the FormControl keys of a FormGroup.
   *
   * @example
   *   <form *ngIf="(form | formKeys).length > 0" [formGroup]="form">
   */
  transform(form: FormGroup): string[] {
    return Object.keys(form.controls);
  }
}

import { ComponentFixture, fakeAsync, flush, inject, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormGroup } from '@angular/forms';

import { CommonPipesModule } from '../shared/pipes.module';

import { AppService } from '../services/app.service';
import { LanguageService } from '../services/language.service';
import { ToastService } from '../services/toast.service';

import { MockLanguageService, MockToastService } from './mock-services.spec';
import { ContactComponent } from '../contact/contact.component';
import { ApiResponseType } from '../shared/common.type';
import { By } from '@angular/platform-browser';

const EMAIL_URL = '//www.ericchristenson.com/message';

describe('ContactComponent', () => {
    let fixture: ComponentFixture<ContactComponent>;
    let comp: ContactComponent;
    let _toastService: ToastService;
    let successSpy: any;
    let errorSpy: any;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ContactComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                CommonPipesModule,
                HttpClientTestingModule
            ],
            providers: [
                AppService,
                { provide: LanguageService, useClass: MockLanguageService },
                { provide: ToastService, useClass: MockToastService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ContactComponent);
        comp = fixture.componentInstance;
        _toastService = fixture.debugElement.injector.get(ToastService);
        successSpy = spyOn(_toastService, 'successToast').and.callThrough();
        errorSpy = spyOn(_toastService, 'errorToast').and.callThrough();

        fixture.detectChanges();

        comp.showContactDialog$.next(true);
    });

    it('should create the component', () => {
        expect(comp).toBeTruthy();
    });

    it('dialog box should be visible', () => {
        expect(comp.visible).toBeTrue();
    });

    describe('given an empty form', () => {
        it('send button should be disabled', () => {
            const sendButton = fixture.debugElement.query(By.css('#sendButton'));
            expect(sendButton.properties.disabled).toBeTrue();
        });

        it('should not send message', () => {
            expect(comp.sendingMessage).toBeFalse();
        });
    });

    describe('given a populated form', async () => {
        beforeEach(() => {
            populateForm(comp.form);
            comp.onSendMessage();
        });

        // mock HTTP request
        beforeEach(inject([HttpTestingController], (testingController: HttpTestingController) => {
            const req = testingController.expectOne({method: 'POST', url: EMAIL_URL});
            req.flush(<ApiResponseType> {
                response: 200,
                message: 'success'
            });
        }));

        it('send button should be enabled', () => {
            const sendButton = fixture.debugElement.query(By.css('#sendButton'));
            expect(sendButton.properties.disabled).toBeFalse();
        });

        it('should show success toast', () => {
            expect(successSpy).toHaveBeenCalled();
        });

        it('should disable contact dialog', fakeAsync(() => {
            comp.showContactDialog$.subscribe(status => expect(status).toBeFalse());
            flush();
        }));
    });

    describe('on closing the dialog box', () => {
        beforeEach(() => {
            comp.onHide();
        });

        it('should reset the form', () => {
            expect(comp.form.pristine).toBeTrue();
        });

        it('should disable contact dialog', fakeAsync(() => {
            comp.showContactDialog$.subscribe(status => expect(status).toBeFalse());
            flush();
        }));
    });
});

/**
 * @param {FormGroup} form
 * @returns {FormGroup}
 */
function populateForm(form: FormGroup) {
    form.patchValue({
        message: 'Hello',
        name: 'Me',
        email: 'example@example.com'
    });
}

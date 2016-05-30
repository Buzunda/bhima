/* global element, by, browser */
const chai = require('chai');
const expect = chai.expect;
const helpers = require('../shared/helpers');
helpers.configure(chai);

const FU = require('../shared/FormUtils');
const components = require('../shared/components');

describe('Employees', function () {
  'use strict';

  const path = '#/employees';
  before(() => helpers.navigate(path));

  const employee = {
    code : 'HBB80',
    prenom : 'Sherlock',
    name : 'Holmes',
    postnom : 'Doyle',
    sexe : 'M',
    dob : new Date('1960-06-30'),
    date_embauche : new Date('1997-05-17'),
    nb_spouse : 1,
    nb_enfant : 2,
    bank : 'BIAC',
    bank_account : '00-99-88-77',
    email : 'me@info.com',
    adresse : '221B Baker Street'
  };

  const employeeId = helpers.random(2);

  it('creates a new employee', function () {
    FU.buttons.create();

    FU.input('EmployeeCtrl.employee.prenom', employee.prenom);
    FU.input('EmployeeCtrl.employee.name', employee.name);
    FU.input('EmployeeCtrl.employee.postnom', employee.postnom);

    // input the date of birth
    components.dateEditor.set(employee.dob, 'employee-dob');
    FU.select('EmployeeCtrl.employee.sexe', 'F');

    FU.input('EmployeeCtrl.employee.nb_spouse', employee.nb_spouse);
    FU.input('EmployeeCtrl.employee.nb_enfant', employee.nb_enfant);

    // select the proper hiring date
    components.dateEditor.set(employee.date_embauche, 'employee-date-hired');

    FU.input('EmployeeCtrl.employee.code', employee.code);
    FU.select('EmployeeCtrl.employee.service_id', 'Administration');
    FU.select('EmployeeCtrl.employee.grade_id', 'A1');
    FU.select('EmployeeCtrl.employee.fonction_id', 'Infirmier');
    FU.select('EmployeeCtrl.employee.creditor_group_uuid', 'Personnel');
    FU.select('EmployeeCtrl.employee.debtor_group_uuid', 'Test Debtor Group');
    FU.input('EmployeeCtrl.employee.email', employee.email);
    FU.input('EmployeeCtrl.employee.adresse', employee.adresse);

    // select the locations specified
    components.locationSelect.set(helpers.data.locations);

    FU.input('EmployeeCtrl.employee.bank', employee.bank);
    FU.input('EmployeeCtrl.employee.bank_account', employee.bank_account);

    // submit the page to the server
    FU.buttons.submit();

    // expect a nice validation message
    FU.exists(by.id('create_success'), true);
  });

  it('edits an employee', function () {
    element(by.id('employee-upd-' + employeeId )).click();

    // modify the employee name
    FU.input('EmployeeCtrl.employee.name', ' Elementary');
    FU.input('EmployeeCtrl.employee.adresse', ' Blvd Lumumba');

    element(by.id('bhima-employee-locked')).click();
    element(by.id('change_employee')).click();

    // make sure the success message appears
    FU.exists(by.id('update_success'), true);
  });

  it('unlocks an employee', function () {
    element(by.id('employee-upd-' + employeeId )).click();
    element(by.id('bhima-employee-locked')).click();
    element(by.id('change_employee')).click();

    // make sure the success message appears
    FU.exists(by.id('update_success'), true);
  });

  it('blocks invalid form submission with relevant error classes', function () {
    FU.buttons.create();

    // verify form has not been submitted
    expect(helpers.getCurrentPath()).to.eventually.equal(path);

    element(by.id('submit-employee')).click();

    // the following fields should be required
    FU.validation.error('EmployeeCtrl.employee.prenom');
    FU.validation.error('EmployeeCtrl.employee.name');
    FU.validation.error('EmployeeCtrl.employee.postnom');
    FU.validation.error('EmployeeCtrl.employee.sexe');
    FU.validation.error('EmployeeCtrl.employee.code');
    FU.validation.error('EmployeeCtrl.employee.service_id');
    FU.validation.error('EmployeeCtrl.employee.grade_id');
    FU.validation.error('EmployeeCtrl.employee.fonction_id');
    FU.validation.error('EmployeeCtrl.employee.creditor_group_uuid');
    FU.validation.error('EmployeeCtrl.employee.debtor_group_uuid');
    FU.validation.error('EmployeeCtrl.employee.adresse');

    // the following fields are not required
    FU.validation.ok('EmployeeCtrl.employee.locked');
    FU.validation.ok('EmployeeCtrl.employee.nb_spouse');
    FU.validation.ok('EmployeeCtrl.employee.nb_enfant');
    FU.validation.ok('EmployeeCtrl.employee.locked');
    FU.validation.ok('EmployeeCtrl.employee.phone');
    FU.validation.ok('EmployeeCtrl.employee.email');
    FU.validation.ok('EmployeeCtrl.employee.bank');
    FU.validation.ok('EmployeeCtrl.employee.bank_account');
  });
});

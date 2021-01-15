import { Component, OnInit, Input, ViewChild, forwardRef, Optional, Host, SkipSelf, ChangeDetectionStrategy, Self } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, ControlContainer, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.control.html',
  styleUrls: ['./input.control.css'],

})
export class InputControl implements ControlValueAccessor, OnInit {
  @Input() label;
  @Input() encrypted = false;
  @Input() placeholder;
  @Input() type;
  @Input() default;
  @Input() autocomplete: 'on' | 'off' = 'on';
  @Input() appearance : 'legacy' | 'outline' | 'fill' = 'legacy'
  _encryptedVisibility: Boolean = false;
  _value: String;
  _errorStatus: Boolean = false;
  _originalLabel;
  isControlInPendingStatus = false;

  constructor (@Optional()@Self() private ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  ngOnInit() {
    this._originalLabel = this.label;
    if(this.default) {
      this.value = this.default;
    }

    this.ngControl.control.parent.statusChanges.subscribe(formStatus => {
      if(formStatus === 'INVALID' && this.ngControl.errors && (this.ngControl.dirty || this.ngControl.touched)) {
        this._errorStatus = true;
        this.label = this.getErrorLabel();
      }
    });

    this.ngControl.statusChanges.subscribe(newStatus => {
      if(newStatus === 'PENDING') {
        this.isControlInPendingStatus = true;
      } else {
        this.isControlInPendingStatus = false;

        this._errorStatus = newStatus === 'VALID'? false : true;

        if(this._errorStatus) {
          this.label = this.getErrorLabel();
        } else {
          this.label = this._originalLabel;
        }
      }

    });

  }

  getErrorLabel() {
    if(this.ngControl.hasError('required')) {
      return this._originalLabel + ' (obligatorio)';
    } else if(this.ngControl.hasError('email')) {
      return this._originalLabel + ' (formato incorrecto)';
    } else if(this.ngControl.hasError('isUserEmailUnique')) {
      return this._originalLabel + ' (ya existe este correo)';
    } else if(this.ngControl.hasError('lettersOnly')) {
      return this._originalLabel + ' (solo letras y espacios)';
    } else if(this.ngControl.hasError('numbersOnly')) {
      return this._originalLabel + ' (solo números)';
    } else if(this.ngControl.hasError('minlength')) {
      return this._originalLabel + ' (muy corto)';
    } else if(this.ngControl.hasError('maxlength')) {
      return this._originalLabel + ' (muy largo)';
    } else if(this.ngControl.hasError('isUserRucUnique')) {
      return this._originalLabel + ' (ya existe este RUC)';
    } else if(this.ngControl.hasError('sufficientBalance')) {
      return this._originalLabel + ' (fondos insuficientes)';
    } else if(this.ngControl.hasError('invoiceSufficientBalance')) {
      return this._originalLabel + ' (no puede ser mayor que el monto disponible)';
    } else if(this.ngControl.hasError('mustMatch')) {
      return this._originalLabel + ' (Contraseña no coincide)';
    } else if(this.ngControl.hasError('rucExactLength')) {
      return this._originalLabel + ' (debe tener 11 dígitos)';
    } else if(this.ngControl.hasError('dniExactLength')) {
      return this._originalLabel + ' (debe tener 8 dígitos)';
    } else if(this.ngControl.hasError('ceExactLength')) {
      return this._originalLabel + ' (debe tener 9 dígitos)';
    } else if(this.ngControl.hasError('phoneExactLength')) {
      return this._originalLabel + ' (debe tener 9 dígitos)';
    } else if(this.ngControl.hasError('passportLengthRange')) {
      return this._originalLabel + ' (debe tener entre 5 y 15 caracteres)';
    } else if(this.ngControl.hasError('money')) {
      //const separator = getDecimalSeparator();
      return this._originalLabel + ` (formato incorrecto: ejemplo 1000.55)`;
    } else if(this.ngControl.hasError('numberMustBeGreaterThanZero')) {
      return this._originalLabel + ` (debe ser mayor que 0)`;

    } else if(this.ngControl.hasError('minimumInvestmentAllowedisAll')) {
      return this._originalLabel + ` (debe ser igual al monto disponible en la factura)`;
    } else if(this.ngControl.hasError('minimumInvestmentAllowedis33')) {
      return this._originalLabel + ` (debe ser mayor que 33 USD)`;
    } else if(this.ngControl.hasError('minimumInvestmentAllowedis100')) {
      return this._originalLabel + ` (debe ser mayor que 100 PEN)`;

    } else if(this.ngControl.hasError('passwordCriteria')) {
      return this._originalLabel + ` (contraseña no segura)`;

    } else {
      console.log(this.ngControl.errors)
      console.log(this.ngControl.control.parent.status)
      return this._originalLabel + ' (inválido)';
    }
  }
  
  toggleEncrypted() {
    this._encryptedVisibility = !this._encryptedVisibility;
  }

  get value() {
    return this._value;
  }

  set value(val) {
    if(val !== undefined) {
      this._value = val;
      this.propagateChange(this._value);
    }
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this.value = value;
    }
  }

  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  calculateType() {
    if(this.encrypted && !this._encryptedVisibility) {
      return 'password';
    } else {
      return 'text';
    }
  }
}


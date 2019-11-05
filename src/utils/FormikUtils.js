import React from 'react';
import * as Yup from 'yup';

const CustomInputComponent = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => (
  <div>
    <input type="text" {...field} {...props} />
    {touched[field.name] &&
      errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </div>
);

function define_validations(web3) {
  let addressSchema;
  let nullableAddressSchema;
  let hexSchema
  let positiveUintSchema;
  let validUintSchema;
  if (web3 == '') {
    addressSchema = Yup.string().test(
      'isValidAddress',
      'Web3 browser not found',
      val => false
    );
    nullableAddressSchema = Yup.string().test(
      'isNullableAddress',
      'Web3 browser not found',
      val => false
    );
    hexSchema = Yup.string().test(
      'isBytes32',
      'Not a valid hexadecimal value',
      val => false
    );
    positiveUintSchema = Yup.string().test(
      'isPositiveUint',
      'Web3 browser not found',
      val => false
    );
    validUintSchema = Yup.string().test(
      'isValidUint',
      'Web3 browser not found',
      val => false
    );
  } else {
    addressSchema = Yup.string().ensure().test(
      'isValidAddress',
      'Not a valid address',
      val => web3.utils.isAddress(val)
    );
    nullableAddressSchema = Yup.string().ensure().test(
      'isNullableAddress',
      'Not a valid address',
      val => ((val == '') || (web3.utils.isAddress(val)))
    );
    hexSchema = Yup.string().ensure().test(
      'isBytes',
      'Not a valid hexadecimal value',
      val => ((val !== '') && (val.replace(/(0x[a-fA-F0-9]*)/, '') == ''))
    );
    positiveUintSchema = Yup.string().ensure().test(
      'isPositiveUint',
      'Not a valid positive value',
      val => ((val !== '') && (val.replace(/([1-9][0-9]*)/, '') == ''))
    );
    validUintSchema = Yup.string().ensure().test(
      'isUint',
      'Not a valid value',
      val => ((val !== '') && (val.replace(/(0|[1-9][0-9]*)/, '') == ''))
    );
  }
  return( {
            addressSchema: addressSchema,
            nullableAddressSchema: nullableAddressSchema,
            hexSchema: hexSchema,
            positiveUintSchema: positiveUintSchema,
            validUintSchema: validUintSchema
          } );
}

function get_schema(keys, web3) {
  let validations = define_validations(web3);
  const master_schema = {
    buyer: validations.addressSchema,
    base_addr: validations.addressSchema,
    asset_addr:validations.addressSchema,
    fee: validations.validUintSchema,
    strike_price_base: validations.positiveUintSchema,
    strike_price_quote: validations.positiveUintSchema,
    volume: validations.positiveUintSchema,
    maturity_time: validations.validUintSchema,
    expiry_time: validations.validUintSchema,
    salt: validations.hexSchema,
    issuer_portfolio: validations.addressSchema,
    buyer_portfolio: validations.addressSchema,
    matched_addr: validations.nullableAddressSchema,
    amount: validations.positiveUintSchema,
  };

  let schema = {};
  let i;
  for (i in keys) {
    if (master_schema[keys[i]] !== 'undefined') {
      schema[keys[i]] = master_schema[keys[i]];
    }
  }
  return Yup.object().shape(schema);
}


export { CustomInputComponent, get_schema };

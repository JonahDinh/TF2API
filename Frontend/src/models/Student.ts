import {
  IsEmail, IsOptional, IsPhoneNumber, Length, MaxLength,
} from 'class-validator';

const emailOptions = {
  allow_display_name: false, // <Bob Smith>bob@smith.ca set to true
  ignore_max_length: false, // maxlength 320 characters
  allow_ip_domain: false, // sally@127.0.1.56 set to true
  // additional validation, e.g. disallowing certain valid emails that are rejected by GMail.
  domain_specific_validation: true,
};

export default class Student {
  @IsOptional()
  id:number|undefined;

  @Length(1, 50, { message: 'Given Name must be from $constraint1 to $constraint2 characters ' })
  givenName='';

  @MaxLength(50, { message: 'Family Name must be at most $constraint1 characters ' })
  @IsOptional()
  familyName ='';

  @IsEmail(emailOptions, { message: 'Email must be in valid format' })
  email = '';

  @IsPhoneNumber('CA', { message: 'Phone number must be in Canadian format' }) // CA is the code code for Canada
  phone='';

  @MaxLength(200, { message: 'Address must be at most $constraint1 characters ' })
  @IsOptional()
  address = '';
}

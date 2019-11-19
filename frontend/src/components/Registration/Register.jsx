import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'
import useRegisterUser from './RegisterUser';
import { Row, Col, TextInput } from 'react-materialize';


const RegisterForm = () => {
  const [okToRedirect, setOkToRedirect] = useState(false);
  const onRegister = async () => {
    try {
      const register = {
        name: inputs.name,
        phone: inputs.phone,
        email: inputs.email,
        password: inputs.password
      }
      const response = await fetch( '/api/register', {
        method: 'POST',
        body: JSON.stringify( register ),
        headers: {
          'Content-type': 'application/json'
        }
      } )
      if ( response.ok ) {
        console.log( response, 'response succeeded' )
        setOkToRedirect(true);
      } else if(!okToRedirect){
        let errorMssg = "Email already exists! Try loggin in"
        alert( errorMssg )
      }
    } catch ( error ) {
      console.log( error, 'Error' )
    }
  }

  function validate( inputs ) {
    let errors = {}
    if ( !inputs.name ) {
      errors.name = "Name field cannot be empty"
    }
    if ( !inputs.email ) {
      errors.email = "Please type in a valid email"
    } else if ( !/\S+@\S+\.\S+/.test( inputs.email ) ) {
      errors.email = 'Email is invalid'
    }
    if ( !inputs.phone ) {
      errors.phone = "Enter a valid phonenumber"
    }
    if ( !inputs.password ) {
      errors.password = "Password is required"
    } else if ( inputs.password.length < 5 ) {
      errors.password = 'Password must be at least 5 or more characters'
    }
    if ( !inputs.confirmPassword ) {
      errors.confirmPassword = "Type in password again"
    } else if ( inputs.confirmPassword !== inputs.password ) {
      errors.confirmPassword = 'Password does not match'
    }
    return errors
  }

  const { errors, inputs, handleSubmit, handleInputChange } = useRegisterUser( onRegister, validate )
  return (
    <>
      {okToRedirect && <Redirect to="/login" />}
      <div className="registration-page container center-align">
        <Row>
          <Col l={3} offset='l2' className='content'>
            <h3>Sign up!</h3>

            <form onSubmit={handleSubmit}>
              <TextInput s={12} l={12}
                label="Name"
                type="text"
                className={`input ${errors.name && 'is-danger'}`}
                name="name"
                value={inputs.name || ''}
                onChange={handleInputChange}
              />
              {errors.name && ( <p className="help is-danger col s12">{errors.name}</p> )}

              <TextInput
                s={12} l={12}
                label="Phonenumber"
                type="text"
                className={`input ${errors.phone && 'is-danger'}`}
                name="phone"
                value={inputs.phone || ''}
                onChange={handleInputChange}
              />
              {errors.phone && ( <p className="help is-danger">{errors.phone}</p> )}

              <TextInput
                s={12} l={12}
                label="Email"
                type="email"
                className={`input ${errors.email && 'is-danger'}`}
                name="email"
                value={inputs.email || ''}
                onChange={handleInputChange}
              />
              {errors.email && ( <p className="help is-danger">{errors.email}</p> )}

              <TextInput
                s={12} l={12}
                label="Password"
                type="password"
                className={`input ${errors.password && 'is-danger'}`}
                name="password"
                value={inputs.password || ''}
                onChange={handleInputChange}
              />
              {errors.password && ( <p className="help is-danger">{errors.password}</p> )}

              <TextInput
                s={12} l={12}
                label="Repeat password" type="password"
                className={`input ${errors.confirmPassword && 'is-danger'}`}
                name="confirmPassword"
                value={inputs.confirmPassword || ''}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && ( <p className="help is-danger">{errors.confirmPassword}</p> )}

              <div className="row">
                <div className="col s12">
                  <button className="submit-btn btn waves-effect waves-light" type="submit" value="submit">Submit</button>
                </div>
              </div>
            </form>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default RegisterForm;

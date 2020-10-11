import React, { useReducer, useEffect } from 'react'
import { Form, Button, FormControl, Spinner } from 'react-bootstrap'
import { FaBug, FaCheckCircle } from 'react-icons/fa'
import axios from 'axios'
import '../Sass/RaielyForm.scss'
const initialState = {
    firstname: '',
    firstnameValid: null,
    firstnameInvalid: null,
    lastname: '',
    lastnameValid: null,
    lastnameInvalid: null,
    email: '',
    emailValid: null,
    emailInvalid: null,
    password: '',
    passwordValid: null,
    passwordInvalid: null,
    Exist: 'Not valid email',
    error: false,
    loading: false,
    success: false
}
const reducer = (state, action) => {
    switch (action.type) {
        case "onChange":
            return {
                ...state,
                [action.feild]: action.value
            };
        case 'firstnameValid':
            return {
                ...state,
                firstnameValid: true,
                firstnameInvalid: null
            };
        case 'firstnameInvalid':
            return {
                ...state,
                firstnameValid: null,
                firstnameInvalid: true
            };
        case 'lastnameValid':
            return {
                ...state,
                lastnameValid: true,
                lastnameInvalid: null
            };
        case 'lastnameInvalid':
            return {
                ...state,
                lastnameValid: null,
                lastnameInvalid: true
            };
        case 'emailValid':
            return {
                ...state,
                emailValid: true,
                emailInvalid: null
            };
        case 'emailInvalid':
            return {
                ...state,
                emailValid: null,
                emailInvalid: true
            };
        case 'emailExist':
            return {
                ...state,
                emailValid: null,
                emailInvalid: true,
                Exist: action.payload
            };
        case 'passwordValid':
            return {
                ...state,
                passwordValid: true,
                passwordInvalid: null
            };
        case 'passwordInvalid':
            return {
                ...state,
                passwordValid: null,
                passwordInvalid: true
            };
        case 'ERROR':
            return {
                ...state,
                error: true,
                loading: false
            };
        case 'LOADING':
            return {
                ...state,
                loading: true
            };
        case 'SUCCESS':
            return {
                ...state,
                loading: false,
                success: true
            };
        default: return state
    }

}
function Forms() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const handleChange = (e) => {
        dispatch({ type: 'onChange', feild: e.target.name, value: e.target.value })
    }
    useEffect(() => {
        if (state.firstname) {
            if (/^[a-zA-Z]{3,}$/g.test(state.firstname)) {
                dispatch({ type: "firstnameValid" })
            }
            else {
                dispatch({ type: 'firstnameInvalid' })
            }
        }

    }, [state.firstname])
    useEffect(() => {
        if (state.lastname) {
            if (/^[a-zA-Z]{3,}$/g.test(state.lastname)) {
                dispatch({ type: "lastnameValid" })
            }
            else {
                dispatch({ type: 'lastnameInvalid' })
            }
        }
    }, [state.lastname])
    useEffect(() => {
        if (state.email) {
            if (/\S+@\S+\.\S+/.test(state.email)) {
                axios.post('https://api.raisely.com/v3/check-user', {
                    campaignUuid: "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a",
                    data: {
                        email: state.email
                    }
                }).then((res) => {
                    if (res.data.data.status === 'OK') {
                        dispatch({ type: "emailValid" })
                    }
                    else {
                        dispatch({ type: 'emailExist', payload: "This Email already exist" })
                    }
                })

            }
            else {
                dispatch({ type: 'emailInvalid' })
            }
        }
    }, [state.email])
    useEffect(() => {
        if (state.password) {
            if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/g.test(state.password)) {
                dispatch({ type: "passwordValid" })
            }
            else {
                dispatch({ type: 'passwordInvalid' })
            }
        }
    }, [state.password])
    const handleSubmit = () => {
        if (state.firstnameValid && state.lastnameValid && state.emailValid && state.passwordValid) {
            dispatch({ type: "LOADING" })
            axios.post('https://api.raisely.com/v3/signup', {
                campaignUuid: "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a",
                data: {
                    firstName: state.firstname,
                    lastName: state.lastname,
                    email: state.email,
                    password: state.password
                }
            }).then((res) => {
                dispatch({ type: 'SUCCESS' })
                console.log(res.data)
            }).catch((err) => {
                console.log(err)
                dispatch({ type: "ERROR" })
            })
        }
        else {
            dispatch({ type: "ERROR" })
        }

    }
    if (state.error) {
        console.log(state.firstnameValid, state.lastnameValid, state.emailValid, state.passwordValid)
        return (
            <div className='Sec'>
                <FaBug color='red' className='Icons' />
                <h1 className='err'>Oops! Error</h1>
            </div>
        )
    }
    else if (state.loading) {
        return (
            <div className='Sec'>
            <Spinner animation="border" variant="info" size='lg' className='Icons'/>
            </div>
        )
    }
    else if (state.success) {
        return (
            <div className='Sec'>
                <FaCheckCircle color='green' className='Icons' />
                <h1 className='success'>Success</h1>
            </div>
        )
    }
    else {
        return (

            <Form className='raiselyForm'>
                <Form.Group controlId="firstName">
                    <label className='FormLabel'>First Name</label>
                    <Form.Control size='lg' type="text" placeholder="Firstname" name='firstname' value={state.firstname} onChange={handleChange} isInvalid={state.firstnameInvalid} isValid={state.firstnameValid} />
                    <FormControl.Feedback type='invalid'>
                        <ul>
                            <li>Must be atleast 3 character long</li>
                            <li>Must be a string</li>
                        </ul>
                    </FormControl.Feedback>
                </Form.Group>
                <Form.Group controlId="lastName">
                    <label className='FormLabel'>Last Name</label>
                    <Form.Control size='lg' type="text" placeholder="Lastname" name='lastname' onChange={handleChange} value={state.lastname} isValid={state.lastnameValid} isInvalid={state.lastnameInvalid} />
                    <FormControl.Feedback type='invalid'>
                        <ul>
                            <li>Must be atleast 3 character long</li>
                            <li>Must be a string</li>
                        </ul>
                    </FormControl.Feedback>
                </Form.Group>
                <Form.Group controlId="Email">
                    <label className='FormLabel'>Email Address</label>
                    <Form.Control size='lg' type="email" placeholder="Enter email" name='email' value={state.email} onChange={handleChange} isValid={state.emailValid} isInvalid={state.emailInvalid} />
                    <FormControl.Feedback type='invalid'>
                        <p>{state.Exist}</p>
                    </FormControl.Feedback>
                </Form.Group>

                <Form.Group controlId="Password">
                    <label className='FormLabel'>Password</label>
                    <Form.Control size='lg' type="password" placeholder="Password" name='password' vlaue={state.password} onChange={handleChange} isValid={state.passwordValid} isInvalid={state.passwordInvalid} />
                    <FormControl.Feedback type='invalid'>
                        <ul>
                            <li>Must be 8 to 15 character long</li>
                            <li>Must have one uppercase and one lowercase</li>
                            <li>Must have one digit</li>
                            <li>Must have one special character</li>
                        </ul>
                    </FormControl.Feedback>
                </Form.Group>

                <Button variant="success" onClick={handleSubmit}>
                    Submit
                 </Button>
            </Form>
        )
    }

}

export default Forms

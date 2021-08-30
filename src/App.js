import React, {useState, useEffect} from "react"
import Amplify, { Auth } from "aws-amplify"
import {Formik, Form, Field} from 'formik'
import styles from './styles'
import awsconfig from './aws-exports'

Amplify.configure(awsconfig);

function App() {
    useEffect(() => {
        new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser()
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
        })
    }, [])
    const [email, setEmail] = useState('')

    const signup = async (values) => {
        try {
            const response = await Auth.signUp({
                username: values.username,
                password: values.password,
                attributes: {
                    email: values.email
                }
            })
            if(response.user) {
                window.alert("Success! Check console for the response data")
                setEmail(values.email)
            }
            console.log(response)
        } catch(error) {
            window.alert("There was an error! Check the console for the response data")
            console.log(error)
        }
    }
    
    const confirmUser = async (code) => {
        try {
            const response = await Auth.confirmSignUp(email, code)
            if(response !== "SUCCESS") {
                throw new Error("Unauthorized")
            }
            window.alert("SUCCESS")
        } catch(err) {
            window.alert("There was an error, check the console for response data")
            console.log(err)
        }
    }

    const showCurrentUser = async () => {
        try {
            const user = await Auth.currentAuthenticatedUser()   
            console.log(user)
        } catch(error) {
            console.log(error)
        }
    }

	return <div className="App">
        <h2>Google Sign In</h2>
        <div style={styles.button}>
            <button onClick={() => {
                Auth.federatedSignIn({provider: 'Google'})
            }}>Sign In With Google</button>
        </div>
        <h2>Facebook Sign In</h2>
        <div style={styles.button}>
            <button onClick={() => {
                // Auth.federatedSignIn({provider: 'Facebook'})
            }}>Sign In With Facebook</button>
        </div>
        <div style={styles.button}>
            <button onClick={showCurrentUser}>Show Current User</button>
        </div>
        <h2>Simple SignUp</h2>
        <Formik 
            initialValues={{
                username: '',
                email: '',
                password: ''
            }}
            onSubmit={async (values) => {
                await signup(values)
            }}
        >
            <Form>
                <Field placeholder="Name" name="username" />
                <Field placeholder="Email" type="email" name="email" />
                <Field placeholder="Password" name="password" type="password" />
                <div style={styles.button}><button type="submit" >Sign Up</button></div>
            </Form>
        </Formik>
        <Formik
            initialValues={{
                code: ""
            }}
            onSubmit={async (values) => {
                await confirmUser(values.code)
            }}
        >
            <Form>
                <h2>Confirm Simple Sign Up</h2>
                <Field name="code" style={styles.tf} placeholder="Enter the verification code sent to your entered email" />
                <div style={styles.button}>
                    <button type="submit">Confirm Sign Up</button>
                </div> 
            </Form>
        </Formik>
    </div>
}

export default App

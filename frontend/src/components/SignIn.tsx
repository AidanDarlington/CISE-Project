import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Rudimentary sign-in logic (e.g., mock authentication)
    if (email === 'user@example.com' && password === 'password') {
      alert('Sign-in successful');
      router.push('/');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className='SignIn'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-6 m-auto'>
            <h1 className='display-4 text-center'>Sign In</h1>
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  name='email'
                  className='form-control'
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <br />
              <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  name='password'
                  className='form-control'
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <br />
              <button type='submit' className='btn btn-outline-info btn-lg btn-block'>
                Sign In
              </button>
            </form>
            <br />
            <Link href='/' className='btn btn-outline-warning btn-block'>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
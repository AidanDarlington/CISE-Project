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
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    // Hardcoded credentials for demonstration purposes
    const hardcodedCredentials = [
      { email: 'admin@example.com', password: 'adminpassword', role: 'admin' },
      { email: 'analyst@example.com', password: 'analystpassword', role: 'analyst' },
      { email: 'viewer@example.com', password: 'viewerpassword', role: 'viewer' },
    ];
  
    const user = hardcodedCredentials.find(
      (cred) => cred.email === email && cred.password === password
    );
  
    if (user) {
      alert('Sign-in successful');
      localStorage.setItem('role', user.role);
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
              <button type='submit' className='btn btn-black'>
                Sign In
              </button>
            </form>
            <br />
            <Link href='/' className='btn btn-black'>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
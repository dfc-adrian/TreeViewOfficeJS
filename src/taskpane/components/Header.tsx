import React, { useState } from 'react';
import { Button, Input, Text, Link } from '@fluentui/react-components';
import { SignOut24Regular } from '@fluentui/react-icons';
import { signUp, signIn, signOut as supabaseSignOut } from '../../services/supabase';

const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
};

const leftSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
};

const logoStyle: React.CSSProperties = {
    height: 40,
    width: 40,
};

const titleStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 600,
    color: '#333',
    letterSpacing: 1,
};

const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
};

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
};

const modalBoxStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
    width: '90%',
    maxWidth: '400px',
    animation: 'fadeIn 0.2s ease-in-out',
};

const modalTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#333',
};

interface HeaderProps {
    onLoginSuccess?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginSuccess }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountType, setAccountType] = useState<'personal' | 'organization'>('personal');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignUp = async () => {
        setErrorMessage('');
        setIsLoading(true);

        try {
            // Validierung
            if (!email || !password || !accountName) {
                setErrorMessage('Alle Felder sind erforderlich');
                setIsLoading(false);
                return;
            }

            if (password.length < 6) {
                setErrorMessage('Passwort muss mindestens 6 Zeichen lang sein');
                setIsLoading(false);
                return;
            }

            // Supabase Sign-Up
            const data = await signUp(email, password, accountName, accountType);

            console.log('✅ Sign-up erfolgreich:', data);
            console.log('Access Token:', data.session?.access_token);

            // Auto-login with same credentials
            console.log('🔄 Auto-login after signup...');
            const loginData = await signIn(email, password);
            console.log('✅ Auto-login erfolgreich:', loginData);

            setIsLoggedIn(true);
            setIsModalOpen(false);

            // Call init after successful login
            if (onLoginSuccess) {
                await onLoginSuccess();
            }

            setEmail('');
            setPassword('');
            setAccountName('');
            setAccountType('personal');
        } catch (error: any) {
            console.error('❌ Sign-up/Login error:', error);
            setErrorMessage(error.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        setErrorMessage('');
        setIsLoading(true);

        try {
            // Validierung
            if (!email || !password) {
                setErrorMessage('Email und Passwort sind erforderlich');
                setIsLoading(false);
                return;
            }

            // Login
            const data = await signIn(email, password);

            console.log('✅ Login erfolgreich:', data);
            console.log('Access Token:', data.session?.access_token);

            setIsLoggedIn(true);
            setIsModalOpen(false);

            // Call init after successful login
            if (onLoginSuccess) {
                await onLoginSuccess();
            }

            setEmail('');
            setPassword('');
        } catch (error: any) {
            console.error('❌ Login error:', error);
            setErrorMessage(error.message || 'Login fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await supabaseSignOut();
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header style={{ ...headerStyle, marginBottom: 18 }}>
            <div style={leftSectionStyle}>
                <img src="assets/IconOfficeJS.png" alt="ChartPanda Logo" style={logoStyle} />
                <span style={titleStyle}>ChartPanda</span>
            </div>
            {isLoggedIn ? (
                <Button
                    appearance="subtle"
                    icon={<SignOut24Regular />}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            ) : (
                <>
                    <Button appearance="primary" onClick={() => setIsModalOpen(true)}>
                        Login
                    </Button>
                    {isModalOpen && (
                        <div style={overlayStyle} onClick={() => !isLoading && setIsModalOpen(false)}>
                            <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
                                <div style={modalTitleStyle}>
                                    {authMode === 'login' ? 'Anmelden' : 'Registrierung'}
                                </div>
                                <div style={formStyle}>
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(_, data) => setEmail(data.value)}
                                        disabled={isLoading}
                                    />
                                    <Input
                                        type="password"
                                        placeholder="Passwort (mindestens 6 Zeichen)"
                                        value={password}
                                        onChange={(_, data) => setPassword(data.value)}
                                        disabled={isLoading}
                                    />
                                    {authMode === 'signup' && (
                                        <Input
                                            placeholder="Unternehmensname"
                                            value={accountName}
                                            onChange={(_, data) => setAccountName(data.value)}
                                            disabled={isLoading}
                                        />
                                    )}
                                    {errorMessage && (
                                        <Text style={{ color: '#d13438', fontSize: '12px' }}>
                                            {errorMessage}
                                        </Text>
                                    )}
                                    <Button
                                        appearance="primary"
                                        onClick={authMode === 'login' ? handleLogin : handleSignUp}
                                        disabled={isLoading}
                                        style={{ width: '100%' }}
                                    >
                                        {isLoading
                                            ? (authMode === 'login' ? 'Wird angemeldet...' : 'Wird registriert...')
                                            : (authMode === 'login' ? 'Anmelden' : 'Registrieren')
                                        }
                                    </Button>
                                    <Link
                                        onClick={() => {
                                            setAuthMode(authMode === 'login' ? 'signup' : 'login');
                                            setErrorMessage('');
                                        }}
                                        style={{ textAlign: 'center', cursor: 'pointer', fontSize: '14px' }}
                                    >
                                        {authMode === 'login'
                                            ? 'Noch kein Account? Registrieren'
                                            : 'Bereits registriert? Anmelden'
                                        }
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </header>
    );
};

export default Header;
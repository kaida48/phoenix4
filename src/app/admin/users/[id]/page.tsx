'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';
import LogsTab from '@/components/LogsTab';

// Terminal Notification Component
function TerminalNotification({ message, onClose }: { message: string, onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={styles.notification}>
      <div style={styles.notificationHeader}>
        &gt; SYSTEM_ALERT
      </div>
      <div style={styles.notificationContent}>
        {message}
      </div>
    </div>
  );
}

// Define styles object
const styles = {
  // Container styles
  terminalContainer: {
    backgroundColor: '#0a0a0a',
    color: '#d89e54', // Amber color similar to Fallout terminals
    fontFamily: "'Courier New', monospace",
    minHeight: '100vh',
    position: 'relative' as const,
    padding: '20px',
    backgroundImage: 'radial-gradient(rgba(16, 16, 16, 0.4) 30%, rgba(0, 0, 0, 0.8) 70%)'
  },
  scanlines: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
    backgroundSize: '100% 4px',
    pointerEvents: 'none' as const,
    zIndex: 2,
    opacity: 0.4,
  },
  terminalContent: {
    position: 'relative' as const,
    zIndex: 1,
    borderRadius: '4px',
    padding: '20px',
    border: '1px solid #444',
    boxShadow: '0 0 20px rgba(216, 158, 84, 0.1)'
  },
  // Header styles
  terminalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #444',
    paddingBottom: '15px',
    marginBottom: '20px'
  },
  terminalTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  terminalPrompt: {
    color: '#d89e54',
    marginRight: '10px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  h1: {
    margin: 0,
    fontSize: '24px',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const
  },
  // Button styles
  terminalBtn: {
    backgroundColor: '#262626',
    color: '#d89e54',
    border: '1px solid #444',
    padding: '8px 16px',
    marginLeft: '10px',
    cursor: 'pointer',
    fontFamily: "'Courier New', monospace",
    fontSize: '14px',
    textTransform: 'uppercase' as const,
    transition: 'all 0.2s',
    position: 'relative' as const
  },
  dangerBtn: {
    borderColor: '#a83232',
  },
  // Tab navigation
  terminalTabs: {
    display: 'flex',
    marginBottom: '20px',
    borderBottom: '1px solid #444'
  },
  terminalTab: {
    backgroundColor: 'transparent',
    color: '#999',
    border: 'none',
    padding: '8px 16px',
    marginRight: '10px',
    cursor: 'pointer',
    fontFamily: "'Courier New', monospace",
    fontSize: '16px',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s',
  },
  activeTab: {
    color: '#d89e54',
    borderBottom: '2px solid #d89e54',
  },
  terminalSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '20px',
    border: '1px solid #444',
    lineHeight: 1.6,
  },
  // Strong text styling
  strong: {
    color: '#d89e54',
    fontWeight: 'bold',
  },
  // Data row styling
  dataRow: {
    marginBottom: '8px',
    display: 'flex',
  },
  label: {
    minWidth: '180px',
    color: '#b7b7b7',
  },
  value: {
    color: '#d89e54',
  },
  // Character card
  characterCard: {
    border: '1px solid #444',
    padding: '15px',
    marginBottom: '15px',
    backgroundColor: 'rgba(40, 40, 40, 0.5)',
  },
  // Security controls
  securityBtn: {
    backgroundColor: '#262626',
    color: '#d89e54',
    border: '1px solid #444',
    padding: '8px 16px',
    marginRight: '10px',
    marginBottom: '15px',
    cursor: 'pointer',
    fontFamily: "'Courier New', monospace",
    fontSize: '14px',
  },
  // Notification styles
  notification: {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #d89e54',
    color: '#d89e54',
    padding: '10px',
    zIndex: 1000,
    fontFamily: "'Courier New', monospace",
    maxWidth: '300px',
    boxShadow: '0 0 10px rgba(216, 158, 84, 0.3)',
  },
  notificationHeader: {
    borderBottom: '1px solid #444',
    paddingBottom: '5px',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  notificationContent: {
    padding: '5px 0',
  },
  // Loading and error states
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    backgroundColor: '#0a0a0a',
    color: '#d89e54',
    fontFamily: "'Courier New', monospace",
  },
  loadingText: {
    fontSize: '18px',
    marginTop: '20px',
  },
  loadingDots: {
    display: 'inline-block',
    animation: 'loading 1.5s infinite',
  },
  errorContainer: {
    padding: '20px',
    backgroundColor: '#0a0a0a',
    color: '#d89e54',
    fontFamily: "'Courier New', monospace",
  },
  backButton: {
    backgroundColor: '#262626',
    color: '#d89e54',
    border: '1px solid #444',
    padding: '8px 16px',
    marginTop: '20px',
    cursor: 'pointer',
    fontFamily: "'Courier New', monospace",
  }
};

interface Character {
  id: string;
  name: string;
  faction: string;
  backstory: string;
  appearance: string | null;
  approved: boolean;
  rejected: boolean;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean | null;
  authToken: string | null;
  verificationToken: string | null;
  characterCount: number;
  approvedCharacterCount: number;
  pendingCharacterCount: number;
  rejectedCharacterCount: number;
  characters: Character[];
}

export default function AdminUserDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [, setImpersonationToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      setNotification('Unauthorized access. Redirecting to login.');
      setTimeout(() => router.push('/login'), 1500);
    }
  }, [session, router]);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${id}`);
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Error fetching user: ${response.status} - ${errorBody}`);
      }
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (newRole: string) => {
    if (window.confirm(`Are you sure you want to change ${user?.username}'s role to ${newRole}?`)) {
      try {
        const response = await fetch(`/api/admin/users/${id}/role`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user?.email, role: newRole })
        });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        fetchUserDetails();
        setNotification(`User role changed to ${newRole} successfully.`);
      } catch (error) {
        console.error('Failed to update user role:', error);
        setNotification('Failed to update user role. Check console for details.');
      }
    }
  };

  const generateToken = async () => {
    try {
      const response = await fetch(`/api/admin/users/${id}/token`, { method: 'POST' });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      console.log('Token generated:', data);
      fetchUserDetails();
      setNotification('Authentication token generated successfully.');
    } catch (error) {
      console.error('Failed to generate token:', error);
      setNotification('Failed to generate token. Check console for details.');
    }
  };

  const revokeToken = async () => {
    try {
      const response = await fetch(`/api/admin/users/${id}/token`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      fetchUserDetails();
      setNotification('Authentication token revoked successfully.');
    } catch (error) {
      console.error('Failed to revoke token:', error);
      setNotification('Failed to revoke token. Check console for details.');
    }
  };

  const startImpersonation = async () => {
    try {
      const response = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id })
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setImpersonationToken(data.token);
      setNotification(`Now impersonating ${user?.username}. Navigate to any page to see results.`);
    } catch (error) {
      console.error('Failed to start impersonation:', error);
      setNotification('Failed to start impersonation. Check console for details.');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <AdminNav />
        <div style={styles.loadingText}>
          LOADING USER DATA<span style={styles.loadingDots}>...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <AdminNav />
        <div>ERROR: {error}</div>
        <button 
          style={styles.backButton} 
          onClick={() => router.push('/admin/users')}
        >
          &lt; BACK TO USERS
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.errorContainer}>
        <AdminNav />
        <div>
          <div>USER_NOT_FOUND</div>
          <div>ERROR_CODE: 404</div>
          <div style={{ marginTop: '15px' }}>
            <Link href="/admin/users" style={{ color: '#d89e54' }}>
              &lt; RETURN_TO_DIRECTORY
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.terminalContainer}>
      <div style={styles.scanlines}></div>
      <AdminNav />
      <div style={styles.terminalContent}>
        <header style={styles.terminalHeader}>
          <div style={styles.terminalTitle}>
            <span style={styles.terminalPrompt}>&gt;</span>
            <h1 style={styles.h1}>USER_PROFILE [ID: {user.id.substring(0, 8)}...]</h1>
          </div>
          <div>
            <button 
              style={{...styles.terminalBtn}}
              onClick={() => updateUserRole(user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
            >
              {user.role === 'ADMIN' ? 'REVOKE_ADMIN' : 'GRANT_ADMIN'}
            </button>
            <button 
              style={{...styles.terminalBtn, ...styles.dangerBtn}}
              onClick={startImpersonation}
            >
              IMPERSONATE_USER
            </button>
          </div>
        </header>
        
        <nav style={styles.terminalTabs}>
          {['overview', 'characters', 'security', 'logs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.terminalTab,
                ...(activeTab === tab ? styles.activeTab : {})
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>
        
        <section style={styles.terminalSection}>
          {activeTab === 'overview' && (
            <div>
              <h2>&gt; USER_DETAILS</h2>
              
              <div style={styles.dataRow}>
                <span style={styles.label}>ID:</span>
                <span style={styles.value}>{user.id}</span>
              </div>
              <div style={styles.dataRow}>
                <span style={styles.label}>USERNAME:</span>
                <span style={styles.value}>{user.username}</span>
              </div>
              <div style={styles.dataRow}>
                <span style={styles.label}>EMAIL:</span>
                <span style={styles.value}>{user.email}</span>
              </div>
              <div style={styles.dataRow}>
                <span style={styles.label}>NAME:</span>
                <span style={styles.value}>{user.name || 'N/A'}</span>
              </div>
              <div style={styles.dataRow}>
                <span style={styles.label}>ROLE:</span>
                <span style={styles.value}>{user.role}</span>
              </div>
              <div style={styles.dataRow}>
                <span style={styles.label}>CREATED_AT:</span>
                <span style={styles.value}>{user.createdAt}</span>
              </div>
              <div style={styles.dataRow}>
                <span style={styles.label}>UPDATED_AT:</span>
                <span style={styles.value}>{user.updatedAt}</span>
              </div>
              <div style={styles.dataRow}>
                <span style={styles.label}>EMAIL_VERIFIED:</span>
                <span style={styles.value}>{user.emailVerified ? 'YES' : 'NO'}</span>
              </div>
              <div style={styles.dataRow}>
                <span style={styles.label}>TOTAL_CHARACTERS:</span>
                <span style={styles.value}>{user.characterCount}</span>
              </div>
              <div style={styles.dataRow}>
                <span style={styles.label}>APPROVED_CHARACTERS:</span>
                <span style={styles.value}>{user.approvedCharacterCount}</span>
              </div>
              <div style={styles.dataRow}>
                <span style={styles.label}>PENDING_CHARACTERS:</span>
                <span style={styles.value}>{user.pendingCharacterCount}</span>
              </div>
              <div style={styles.dataRow}>
                <span style={styles.label}>REJECTED_CHARACTERS:</span>
                <span style={styles.value}>{user.rejectedCharacterCount}</span>
              </div>
            </div>
          )}

          {activeTab === 'characters' && (
            <div>
              <h2>&gt; CHARACTER_RECORDS</h2>
              {user.characters.length > 0 ? (
                user.characters.map((character) => (
                  <div key={character.id} style={styles.characterCard}>
                    <div style={styles.dataRow}>
                      <span style={styles.label}>NAME:</span>
                      <span style={styles.value}>{character.name}</span>
                    </div>
                    <div style={styles.dataRow}>
                      <span style={styles.label}>FACTION:</span>
                      <span style={styles.value}>{character.faction}</span>
                    </div>
                    <div style={styles.dataRow}>
                      <span style={styles.label}>STATUS:</span>
                      <span style={styles.value}>
                        {character.approved ? 'APPROVED' : character.rejected ? 'REJECTED' : 'PENDING'}
                      </span>
                    </div>
                    <div style={styles.dataRow}>
                      <span style={styles.label}>CREATED:</span>
                      <span style={styles.value}>{character.createdAt}</span>
                    </div>
                    <details>
                      <summary style={{ color: '#b7b7b7', cursor: 'pointer', marginTop: '8px' }}>
                        VIEW_DETAILS
                      </summary>
                      <div style={{ marginTop: '10px', padding: '0 10px' }}>
                        <div style={styles.dataRow}>
                          <span style={styles.label}>ID:</span>
                          <span style={styles.value}>{character.id}</span>
                        </div>
                        <div style={{ margin: '10px 0' }}>
                          <div style={{ color: '#b7b7b7', marginBottom: '5px' }}>BACKSTORY:</div>
                          <div style={{ 
                            color: '#d89e54', 
                            backgroundColor: 'rgba(0,0,0,0.2)', 
                            padding: '10px', 
                            maxHeight: '150px', 
                            overflowY: 'auto'
                          }}>
                            {character.backstory}
                          </div>
                        </div>
                        {character.appearance && (
                          <div style={{ margin: '10px 0' }}>
                            <div style={{ color: '#b7b7b7', marginBottom: '5px' }}>APPEARANCE:</div>
                            <div style={{ 
                              color: '#d89e54', 
                              backgroundColor: 'rgba(0,0,0,0.2)', 
                              padding: '10px', 
                              maxHeight: '150px', 
                              overflowY: 'auto'
                            }}>
                              {character.appearance}
                            </div>
                          </div>
                        )}
                      </div>
                    </details>
                  </div>
                ))
              ) : (
                <p>NO_CHARACTERS_FOUND</p>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2>&gt; SECURITY_CONTROLS</h2>
              <div style={{ marginBottom: '20px' }}>
                <button 
                  onClick={generateToken} 
                  style={styles.securityBtn}
                >
                  GENERATE_TOKEN
                </button>
                <button 
                  onClick={revokeToken} 
                  style={styles.securityBtn}
                >
                  REVOKE_TOKEN
                </button>
              </div>
              <div style={styles.dataRow}>
                <span style={styles.label}>AUTH_TOKEN:</span>
                <span style={styles.value}>{user.authToken || 'NONE'}</span>
              </div>
              <div style={styles.dataRow}>
                <span style={styles.label}>VERIFICATION_TOKEN:</span>
                <span style={styles.value}>{user.verificationToken || 'NONE'}</span>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div>
              <h2>&gt; USER_ACTIVITY_LOGS</h2>
              <LogsTab user={user} />
            </div>
          )}
        </section>
      </div>
      
      {notification && (
        <TerminalNotification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

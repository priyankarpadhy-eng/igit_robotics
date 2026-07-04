import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import {
  eventsService,
  galleryService,
  membersService,
  getDbHealth,
  seedDatabase,
  defaultEvents,
  defaultGallery,
  defaultMembers
} from '../services/dbService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('events');

  // DB connection health state
  const [dbHealth, setDbHealth] = useState({ firebaseConnected: false, collectionsFound: { events: false, gallery: false, members: false } });

  // Data states
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [members, setMembers] = useState([]);

  // Form States - Events
  const [eventForm, setEventForm] = useState({ id: null, title: '', desc: '', dateMonth: '', dateDay: '', location: '', price: '', image: '', color: '#0f172a', status: 'UPCOMING' });
  // Form States - Gallery
  const [galleryForm, setGalleryForm] = useState({ id: null, url: '', title: '', context: '' });
  // Form States - Members
  const [memberForm, setMemberForm] = useState({ id: null, name: '', role: '', color: '#ffcd6d', batch: '', img: '', category: 'leadership' });

  // Loading & Message States
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: '', text: '' });

  const triggerToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: '', type: '' }), 3000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const health = await getDbHealth();
      setDbHealth(health);

      const evs = await eventsService.getAll();
      const gal = await galleryService.getAll();
      const mems = await membersService.getAll();

      setEvents(evs);
      setGallery(gal);
      setMembers(mems);
    } catch (e) {
      triggerToast('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // --- CRUD: EVENTS ---
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (eventForm.id) {
        await eventsService.update(eventForm.id, eventForm);
        triggerToast('Event updated successfully');
      } else {
        await eventsService.create(eventForm);
        triggerToast('Event created successfully');
      }
      setEventForm({ id: null, title: '', desc: '', dateMonth: '', dateDay: '', location: '', price: '', image: '', color: '#0f172a', status: 'UPCOMING' });
      loadAllData();
    } catch (err) {
      triggerToast('Failed to save event', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEventDelete = async (id, title) => {
    if (!window.confirm(`Delete event "${title}"?`)) return;
    setLoading(true);
    try {
      await eventsService.delete(id, title);
      triggerToast('Event deleted successfully');
      loadAllData();
    } catch (err) {
      triggerToast('Failed to delete event', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD: GALLERY ---
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await galleryService.create(galleryForm);
      triggerToast('Gallery image added successfully');
      setGalleryForm({ id: null, url: '', title: '', context: '' });
      loadAllData();
    } catch (err) {
      triggerToast('Failed to add image', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryDelete = async (id, url) => {
    if (!window.confirm('Delete this gallery image?')) return;
    setLoading(true);
    try {
      await galleryService.delete(id, url);
      triggerToast('Gallery image deleted');
      loadAllData();
    } catch (err) {
      triggerToast('Failed to delete image', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD: MEMBERS ---
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (memberForm.id) {
        await membersService.update(memberForm.id, memberForm);
        triggerToast('Member profile updated');
      } else {
        await membersService.create(memberForm);
        triggerToast('Member profile added');
      }
      setMemberForm({ id: null, name: '', role: '', color: '#ffcd6d', batch: '', img: '', category: 'leadership' });
      loadAllData();
    } catch (err) {
      triggerToast('Failed to save member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMemberDelete = async (id, name) => {
    if (!window.confirm(`Delete profile for "${name}"?`)) return;
    setLoading(true);
    try {
      await membersService.delete(id, name);
      triggerToast('Member profile deleted');
      loadAllData();
    } catch (err) {
      triggerToast('Failed to delete member', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- SEED UTILITY ---
  const handleResetLocal = () => {
    if (!window.confirm('Reset all LocalStorage data to system defaults? This will erase custom additions.')) return;
    seedDatabase.resetLocal();
    triggerToast('Local storage reset to defaults');
    loadAllData();
  };

  const handleSyncToFirestore = async () => {
    if (!window.confirm('Sync default templates directly to Firestore? Make sure database has appropriate permissions.')) return;
    setLoading(true);
    try {
      await seedDatabase.syncToFirestore();
      triggerToast('Firestore collections seeded successfully');
      loadAllData();
    } catch (err) {
      triggerToast('Failed to sync to Firestore (check rules)', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-root">
      {/* Toast Alert */}
      {toast.text && (
        <div className={`toast-alert ${toast.type}`}>
          {toast.text}
        </div>
      )}

      {/* Header */}
      <header className="admin-header">
        <div className="logo-container">
          <span className="logo-text">AXIOM <span className="logo-sub">RC</span></span>
          <span className="badge-tag">ADMIN HUB</span>
        </div>
        <div className="user-nav">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">DISCONNECT</button>
        </div>
      </header>

      {/* Content Wrapper */}
      <div className="admin-container">
        {/* Sidebar Tabs */}
        <aside className="admin-sidebar">
          <nav className="tab-menu">
            <button onClick={() => setActiveTab('events')} className={`tab-link ${activeTab === 'events' ? 'active' : ''}`}>
              EVENTS
            </button>
            <button onClick={() => setActiveTab('gallery')} className={`tab-link ${activeTab === 'gallery' ? 'active' : ''}`}>
              GALLERY
            </button>
            <button onClick={() => setActiveTab('members')} className={`tab-link ${activeTab === 'members' ? 'active' : ''}`}>
              MEMBERS
            </button>
            <button onClick={() => setActiveTab('database')} className={`tab-link ${activeTab === 'database' ? 'active' : ''}`}>
              DATABASE & SYNC
            </button>
          </nav>
          
          {/* Health indicator */}
          <div className="connection-card">
            <div className="card-label">DATABASE SYNC STATUS</div>
            <div className="indicator-row">
              <span className={`status-dot ${dbHealth.firebaseConnected ? 'online' : 'offline'}`} />
              <span className="status-label">{dbHealth.firebaseConnected ? 'Firestore Live' : 'LocalStorage Mode'}</span>
            </div>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="admin-main">
          {loading && <div className="loading-bar">PROCESSING OPERATIONS...</div>}

          {/* EVENTS WORKSPACE */}
          {activeTab === 'events' && (
            <div className="workspace-tab">
              <div className="split-view">
                {/* Form column */}
                <div className="form-column">
                  <h2 className="section-title">{eventForm.id ? 'EDIT EVENT' : 'CREATE EVENT'}</h2>
                  <form onSubmit={handleEventSubmit} className="admin-form">
                    <div className="form-group">
                      <label>EVENT TITLE</label>
                      <input 
                        type="text" 
                        value={eventForm.title} 
                        onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                        placeholder="e.g. ROS Masterclass"
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>DESCRIPTION</label>
                      <textarea 
                        value={eventForm.desc} 
                        onChange={e => setEventForm({ ...eventForm, desc: e.target.value })}
                        placeholder="Short summary of event module details..."
                        required 
                      />
                    </div>

                    <div className="row-group">
                      <div className="form-group">
                        <label>MONTH</label>
                        <input 
                          type="text" 
                          value={eventForm.dateMonth} 
                          onChange={e => setEventForm({ ...eventForm, dateMonth: e.target.value.toUpperCase() })}
                          placeholder="e.g. OCT"
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>DAY</label>
                        <input 
                          type="text" 
                          value={eventForm.dateDay} 
                          onChange={e => setEventForm({ ...eventForm, dateDay: e.target.value })}
                          placeholder="e.g. 04"
                          required 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>LOCATION</label>
                      <input 
                        type="text" 
                        value={eventForm.location} 
                        onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                        placeholder="e.g. IGIT Auditorium or Virtual"
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>TICKET / PRICE</label>
                      <input 
                        type="text" 
                        value={eventForm.price} 
                        onChange={e => setEventForm({ ...eventForm, price: e.target.value })}
                        placeholder="e.g. Starts from ₹150"
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>IMAGE URL</label>
                      <input 
                        type="url" 
                        value={eventForm.image} 
                        onChange={e => setEventForm({ ...eventForm, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        required 
                      />
                    </div>

                    <div className="row-group">
                      <div className="form-group">
                        <label>STATUS</label>
                        <select 
                          value={eventForm.status} 
                          onChange={e => setEventForm({ ...eventForm, status: e.target.value })}
                        >
                          <option value="UPCOMING">UPCOMING</option>
                          <option value="LIVE">LIVE</option>
                          <option value="FINISHED">FINISHED</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>THEME COLOR (HEX)</label>
                        <input 
                          type="color" 
                          value={eventForm.color} 
                          onChange={e => setEventForm({ ...eventForm, color: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="btn-group">
                      <button type="submit" className="btn-save">
                        {eventForm.id ? 'UPDATE EVENT' : 'PUBLISH EVENT'}
                      </button>
                      {eventForm.id && (
                        <button type="button" className="btn-cancel" onClick={() => setEventForm({ id: null, title: '', desc: '', dateMonth: '', dateDay: '', location: '', price: '', image: '', color: '#0f172a', status: 'UPCOMING' })}>
                          CANCEL
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* List column */}
                <div className="list-column">
                  <h2 className="section-title">CURRENT EVENTS ({events.length})</h2>
                  <div className="item-grid">
                    {events.map((ev, i) => (
                      <div key={ev.id || i} className="admin-item-card">
                        <div className="card-image-box">
                          <img src={ev.image} alt={ev.title} />
                          <span className={`card-badge ${ev.status.toLowerCase()}`}>{ev.status}</span>
                        </div>
                        <div className="card-body">
                          <div className="card-meta">{ev.dateMonth} {ev.dateDay} // {ev.location}</div>
                          <h3 className="card-title">{ev.title}</h3>
                          <div className="card-actions">
                            <button onClick={() => setEventForm(ev)} className="btn-action-edit">EDIT</button>
                            <button onClick={() => handleEventDelete(ev.id, ev.title)} className="btn-action-delete">DELETE</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GALLERY WORKSPACE */}
          {activeTab === 'gallery' && (
            <div className="workspace-tab">
              <div className="split-view">
                {/* Form column */}
                <div className="form-column">
                  <h2 className="section-title">ADD IMAGE TO GALLERY</h2>
                  <form onSubmit={handleGallerySubmit} className="admin-form">
                    <div className="form-group">
                      <label>IMAGE URL</label>
                      <input 
                        type="url" 
                        value={galleryForm.url} 
                        onChange={e => setGalleryForm({ ...galleryForm, url: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>CAPTION / TITLE</label>
                      <input 
                        type="text" 
                        value={galleryForm.title} 
                        onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                        placeholder="e.g. Drone Flight Test"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>CATEGORY / CONTEXT</label>
                      <input 
                        type="text" 
                        value={galleryForm.context} 
                        onChange={e => setGalleryForm({ ...galleryForm, context: e.target.value })}
                        placeholder="e.g. Debugging logs on autonomous run"
                        required 
                      />
                    </div>
                    <button type="submit" className="btn-save">UPLOAD TO GALLERY</button>
                  </form>
                </div>

                {/* List column */}
                <div className="list-column">
                  <h2 className="section-title">GALLERY IMAGES ({gallery.length})</h2>
                  <div className="item-grid-slim">
                    {gallery.map((img, i) => (
                      <div key={img.id || i} className="admin-item-card-slim">
                        <img src={img.url} alt={img.title} />
                        <div className="card-body">
                          <h4 className="card-title-slim">{img.title}</h4>
                          <button onClick={() => handleGalleryDelete(img.id, img.url)} className="btn-action-delete-slim">REMOVE</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MEMBERS WORKSPACE */}
          {activeTab === 'members' && (
            <div className="workspace-tab">
              <div className="split-view">
                {/* Form column */}
                <div className="form-column">
                  <h2 className="section-title">{memberForm.id ? 'EDIT PROFILE' : 'ADD MEMBER'}</h2>
                  <form onSubmit={handleMemberSubmit} className="admin-form">
                    <div className="form-group">
                      <label>FULL NAME</label>
                      <input 
                        type="text" 
                        value={memberForm.name} 
                        onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                        placeholder="e.g. Satya Sworup Pradhan"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>ROLE TITLE</label>
                      <input 
                        type="text" 
                        value={memberForm.role} 
                        onChange={e => setMemberForm({ ...memberForm, role: e.target.value })}
                        placeholder="e.g. Robotics Representative"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>BATCH / DEPARTMENT</label>
                      <input 
                        type="text" 
                        value={memberForm.batch} 
                        onChange={e => setMemberForm({ ...memberForm, batch: e.target.value })}
                        placeholder="e.g. 43rd Batch or Dept. of CS"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>IMAGE FILENAME / PATH</label>
                      <input 
                        type="text" 
                        value={memberForm.img} 
                        onChange={e => setMemberForm({ ...memberForm, img: e.target.value })}
                        placeholder="e.g. /satys-sworup.png"
                      />
                    </div>
                    <div className="row-group">
                      <div className="form-group">
                        <label>CATEGORY</label>
                        <select 
                          value={memberForm.category} 
                          onChange={e => setMemberForm({ ...memberForm, category: e.target.value })}
                        >
                          <option value="faculty">FACULTY ADVISOR</option>
                          <option value="leadership">LEADERSHIP BOARD</option>
                          <option value="alumni">ALUMNI NETWORK</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>HIGHLIGHT COLOR (HEX)</label>
                        <input 
                          type="color" 
                          value={memberForm.color} 
                          onChange={e => setMemberForm({ ...memberForm, color: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="btn-group">
                      <button type="submit" className="btn-save">
                        {memberForm.id ? 'UPDATE PROFILE' : 'SAVE MEMBER'}
                      </button>
                      {memberForm.id && (
                        <button type="button" className="btn-cancel" onClick={() => setMemberForm({ id: null, name: '', role: '', color: '#ffcd6d', batch: '', img: '', category: 'leadership' })}>
                          CANCEL
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* List column */}
                <div className="list-column">
                  <h2 className="section-title">MEMBER DIRECTORY ({members.length})</h2>
                  <div className="item-grid">
                    {members.map((m, i) => (
                      <div key={m.id || i} className="admin-item-card flex-row">
                        <div className="member-avatar-box" style={{ borderColor: m.color }}>
                          {m.img ? (
                            <img src={m.img} alt={m.name} />
                          ) : (
                            <div className="avatar-fallback">{m.name.charAt(0)}</div>
                          )}
                        </div>
                        <div className="member-body">
                          <h3 className="member-name">{m.name}</h3>
                          <div className="member-subtitle">{m.role} // {m.batch}</div>
                          <span className="member-badge-cat">{m.category.toUpperCase()}</span>
                          <div className="card-actions mt-3">
                            <button onClick={() => setMemberForm(m)} className="btn-action-edit">EDIT</button>
                            <button onClick={() => handleMemberDelete(m.id, m.name)} className="btn-action-delete">DELETE</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DATABASE & SYNC WORKSPACE */}
          {activeTab === 'database' && (
            <div className="workspace-tab text-left">
              <h2 className="section-title">DATABASE MANAGEMENT & SEED TOOLS</h2>
              <p className="description-text">
                The IGIT Robotics web portal runs on a dual-layer database architecture. By default, it syncs with a Firebase Firestore database. If connection fails or collections are missing, it falls back to LocalStorage so you can still add, edit, and delete contents dynamically with zero downtime.
              </p>

              <div className="db-health-grid">
                <div className="health-card">
                  <h4>FIRESTORE CONNECTION</h4>
                  <div className="health-status">
                    <span className={`status-dot ${dbHealth.firebaseConnected ? 'online' : 'offline'}`} />
                    <span>{dbHealth.firebaseConnected ? 'CONNECTED' : 'DISCONNECTED / OFFLINE'}</span>
                  </div>
                </div>
                <div className="health-card">
                  <h4>DETECTED COLLECTIONS</h4>
                  <ul className="table-list">
                    <li>events: <span className={dbHealth.collectionsFound.events ? 'text-success' : 'text-danger'}>{dbHealth.collectionsFound.events ? 'FOUND' : 'MISSING'}</span></li>
                    <li>gallery: <span className={dbHealth.collectionsFound.gallery ? 'text-success' : 'text-danger'}>{dbHealth.collectionsFound.gallery ? 'FOUND' : 'MISSING'}</span></li>
                    <li>members: <span className={dbHealth.collectionsFound.members ? 'text-success' : 'text-danger'}>{dbHealth.collectionsFound.members ? 'FOUND' : 'MISSING'}</span></li>
                  </ul>
                </div>
              </div>

              {!dbHealth.firebaseConnected ? (
                <div className="sql-instruction-box">
                  <h4>⚠️ DATABASE ACTION REQUIRED</h4>
                  <p>To connect the web-portal fully with Firestore, make sure your Firestore database is initialized in your Firebase Console and the security rules allow reads/writes.</p>
                </div>
              ) : (
                <div className="sql-instruction-box success">
                  <h4>✅ DYNAMIC CONNECTION ACTIVE</h4>
                  <p>All updates you make on this dashboard will be pushed instantly to your Firestore collections and reflect live on the website.</p>
                </div>
              )}

              <div className="seeding-section">
                <h3>UTILITY SEEDING TOOLS</h3>
                <div className="button-grid">
                  <div className="utility-btn-card">
                    <h5>Reset LocalStorage Cache</h5>
                    <p>Wipes current LocalStorage overrides and re-seeds it with the original website templates.</p>
                    <button onClick={handleResetLocal} className="btn-utility">RESET LOCAL CACHE</button>
                  </div>
                  
                  <div className="utility-btn-card">
                    <h5>Sync Templates to Firestore</h5>
                    <p>Loads all default members, events, and gallery items directly into your Firestore database. Only use this once connectivity is verified.</p>
                    <button onClick={handleSyncToFirestore} className="btn-utility primary" disabled={!dbHealth.firebaseConnected}>
                      SEED FIRESTORE COLLECTIONS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .admin-root {
          min-height: 100vh;
          background: #070a13;
          color: #f1f5f9;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .toast-alert {
          position: fixed;
          top: 24px;
          right: 24px;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          z-index: 10000;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          background: #10b981;
          color: white;
          animation: slideIn 0.3s ease-out;
        }
        .toast-alert.error {
          background: #ef4444;
        }

        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 2rem;
          background: #0a0f1d;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .logo-text {
          font-weight: 900;
          font-size: 1.25rem;
          letter-spacing: -0.5px;
          color: white;
        }
        .logo-sub {
          color: #fbc531;
        }
        .badge-tag {
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 1px;
          color: #64748b;
          border: 1px solid rgba(255,255,255,0.15);
          padding: 2px 8px;
          border-radius: 4px;
          margin-left: 12px;
          vertical-align: middle;
        }

        .user-nav {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .user-email {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 700;
        }
        .btn-logout {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          color: #f1f5f9;
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 1px;
          padding: 6px 16px;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-logout:hover {
          background: white;
          color: black;
          border-color: white;
        }

        .admin-container {
          display: flex;
          flex: 1;
        }

        .admin-sidebar {
          width: 260px;
          background: #090d18;
          border-right: 1px solid rgba(255,255,255,0.06);
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .tab-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tab-link {
          background: transparent;
          border: none;
          color: #64748b;
          text-align: left;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 1px;
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tab-link:hover, .tab-link.active {
          color: white;
          background: rgba(255,255,255,0.04);
        }
        .tab-link.active {
          border-left: 2px solid #fbc531;
          border-radius: 0 8px 8px 0;
          padding-left: 14px;
        }

        .connection-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 16px;
        }
        .card-label {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 1px;
          color: #64748b;
          margin-bottom: 8px;
        }
        .indicator-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .status-dot.online { background: #10b981; }
        .status-dot.offline { background: #ef4444; }
        .status-label {
          font-size: 0.8rem;
          font-weight: 700;
        }

        .admin-main {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
          position: relative;
        }

        .loading-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: #fbc531;
          color: black;
          font-size: 0.75rem;
          font-weight: 800;
          text-align: center;
          padding: 4px;
          letter-spacing: 1px;
        }

        .split-view {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 40px;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -0.5px;
          margin-bottom: 24px;
          text-align: left;
        }

        .admin-form {
          background: #090d18;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 24px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group label {
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 1px;
          color: #64748b;
        }
        .form-group input, .form-group textarea, .form-group select {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: white;
          padding: 10px 12px;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: #fbc531;
          background: rgba(0,0,0,0.5);
        }
        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }

        .row-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .btn-group {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .btn-save {
          flex: 1;
          background: #fbc531;
          color: black;
          font-weight: 900;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
          border: none;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-save:hover {
          background: #f1b31c;
          transform: translateY(-1px);
        }
        .btn-cancel {
          background: rgba(255,255,255,0.05);
          color: white;
          font-weight: 800;
          font-size: 0.8rem;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 18px;
          border-radius: 8px;
          cursor: pointer;
        }

        .item-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }
        .item-grid-slim {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }

        .admin-item-card {
          background: #090d18;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .admin-item-card.flex-row {
          flex-direction: row;
          padding: 16px;
          gap: 16px;
          align-items: center;
        }

        .card-image-box {
          height: 140px;
          position: relative;
          overflow: hidden;
        }
        .card-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .card-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 0.6rem;
          font-weight: 900;
          color: white;
          padding: 3px 8px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }
        .card-badge.live { background: #ef4444; }
        .card-badge.upcoming { background: #3b82f6; }
        .card-badge.finished { background: #1e293b; }

        .card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .card-meta {
          font-size: 0.75rem;
          font-weight: 800;
          color: #64748b;
          margin-bottom: 6px;
        }
        .card-title {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 0 0 16px 0;
          line-height: 1.2;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }
        .btn-action-edit {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
        }
        .btn-action-edit:hover {
          background: white;
          color: black;
        }
        .btn-action-delete {
          flex: 1;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
        }
        .btn-action-delete:hover {
          background: #ef4444;
          color: white;
        }

        .admin-item-card-slim {
          background: #090d18;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          overflow: hidden;
          text-align: left;
        }
        .admin-item-card-slim img {
          width: 100%;
          height: 120px;
          object-fit: cover;
        }
        .card-title-slim {
          font-size: 0.8rem;
          font-weight: 800;
          margin: 0 0 10px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .btn-action-delete-slim {
          width: 100%;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 4px;
          border-radius: 4px;
          cursor: pointer;
        }

        /* Members List Specifics */
        .member-avatar-box {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          border: 2px solid;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
        }
        .member-avatar-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatar-fallback {
          font-weight: 900;
          font-size: 1.5rem;
          color: white;
        }
        .member-body {
          flex: 1;
        }
        .member-name {
          font-size: 1.05rem;
          font-weight: 800;
          margin: 0 0 2px 0;
        }
        .member-subtitle {
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 6px;
        }
        .member-badge-cat {
          font-size: 0.6rem;
          font-weight: 900;
          letter-spacing: 0.5px;
          background: rgba(255,255,255,0.06);
          color: #94a3b8;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .mt-3 {
          margin-top: 12px;
        }

        /* Database tab styling */
        .description-text {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #94a3b8;
          max-width: 760px;
          margin-bottom: 32px;
        }
        .db-health-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 760px;
          margin-bottom: 32px;
        }
        .health-card {
          background: #090d18;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 24px;
          border-radius: 16px;
        }
        .health-card h4 {
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 1px;
          color: #64748b;
          margin: 0 0 12px 0;
        }
        .health-status {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 1.1rem;
        }
        .table-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .text-success { color: #10b981; }
        .text-danger { color: #ef4444; }

        .sql-instruction-box {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.15);
          padding: 24px;
          border-radius: 16px;
          max-width: 760px;
          margin-bottom: 40px;
        }
        .sql-instruction-box.success {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.15);
        }
        .sql-instruction-box h4 {
          font-size: 0.85rem;
          font-weight: 900;
          margin: 0 0 8px 0;
        }
        .sql-instruction-box p {
          font-size: 0.85rem;
          line-height: 1.5;
          color: #94a3b8;
          margin: 0 0 12px 0;
        }
        .filepath {
          background: black;
          color: #fbc531;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.85rem;
        }

        .seeding-section {
          max-width: 760px;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 32px;
        }
        .seeding-section h3 {
          font-size: 1.2rem;
          font-weight: 900;
          margin-bottom: 20px;
        }
        .button-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .utility-btn-card {
          background: #090d18;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 20px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
        }
        .utility-btn-card h5 {
          font-size: 0.9rem;
          font-weight: 800;
          margin: 0 0 6px 0;
        }
        .utility-btn-card p {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0 0 16px 0;
          line-height: 1.4;
          flex: 1;
        }
        .btn-utility {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          font-weight: 800;
          font-size: 0.75rem;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
        }
        .btn-utility.primary {
          background: #fbc531;
          color: black;
          border: none;
          font-weight: 900;
        }
        .btn-utility.primary:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

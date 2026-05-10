'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Category State
  const [newCatId, setNewCatId] = useState('');
  const [newCatName, setNewCatName] = useState('');

  // Edit Category State
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatName, setEditCatName] = useState('');

  // Edit Image State
  const [editingImageId, setEditingImageId] = useState(null);
  const [editImageTitle, setEditImageTitle] = useState('');
  const [editImageDesc, setEditImageDesc] = useState('');
  const [editImageCat, setEditImageCat] = useState('');

  // New Image State
  const [file, setFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  // Reviews State
  const [reviews, setReviews] = useState([]);

  // Services State
  const [services, setServices] = useState([]);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceIcon, setNewServiceIcon] = useState('');

  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editServiceTitle, setEditServiceTitle] = useState('');
  const [editServiceDesc, setEditServiceDesc] = useState('');
  const [editServiceIcon, setEditServiceIcon] = useState('');

  const fetchData = async () => {
    // Auth Check
    const auth = localStorage.getItem('admin_auth');
    if (auth !== 'true') {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    
    setIsLoading(true);
    try {
      const [galRes, revRes, servRes] = await Promise.all([
        fetch('/api/gallery'),
        fetch('/api/reviews'),
        fetch('/api/services')
      ]);
      const [galData, revData, servData] = await Promise.all([
        galRes.json(),
        revRes.json(),
        servRes.json()
      ]);
      setCategories(galData.categories || []);
      setItems(galData.items || []);
      setReviews(revData || []);
      setServices(servData || []);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatId || !newCatName) return;

    const formData = new FormData();
    formData.append('action', 'addCategory');
    formData.append('id', newCatId.toLowerCase().replace(/\s+/g, '-'));
    formData.append('name', newCatName);

    try {
      const res = await fetch('/api/gallery', { method: 'POST', body: formData });
      if (res.ok) {
        setNewCatId('');
        setNewCatName('');
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditCategory = async (id) => {
    if (!editCatName) return;
    const formData = new FormData();
    formData.append('action', 'editCategory');
    formData.append('id', id);
    formData.append('newName', editCatName);

    try {
      const res = await fetch('/api/gallery', { method: 'POST', body: formData });
      if (res.ok) {
        setEditingCatId(null);
        setEditCatName('');
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this tag? Images using this tag will remain but may lose their category filter.')) return;
    const formData = new FormData();
    formData.append('action', 'deleteCategory');
    formData.append('id', id);

    try {
      const res = await fetch('/api/gallery', { method: 'POST', body: formData });
      if (res.ok) fetchGallery();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditImage = async (id) => {
    const formData = new FormData();
    formData.append('action', 'editImage');
    formData.append('id', id);
    formData.append('title', editImageTitle);
    formData.append('desc', editImageDesc);
    formData.append('category', editImageCat);

    try {
      const res = await fetch('/api/gallery', { method: 'POST', body: formData });
      if (res.ok) {
        setEditingImageId(null);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!file || !selectedCategory) return;

    const formData = new FormData();
    formData.append('action', 'addImage');
    formData.append('file', file);
    formData.append('category', selectedCategory);
    formData.append('title', title);
    formData.append('desc', desc);

    try {
      const res = await fetch('/api/gallery', { method: 'POST', body: formData });
      if (res.ok) {
        setFile(null);
        setTitle('');
        setDesc('');
        document.getElementById('file-upload').value = '';
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      if (res.ok) fetchData();
    } catch (e) { console.error(e); }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', service: { title: newServiceTitle, desc: newServiceDesc, icon: newServiceIcon } })
      });
      if (res.ok) {
        setNewServiceTitle(''); setNewServiceDesc(''); setNewServiceIcon('');
        fetchData();
      }
    } catch (e) { console.error(e); }
  };

  const handleEditService = async (id) => {
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'edit', id, service: { title: editServiceTitle, desc: editServiceDesc, icon: editServiceIcon } })
      });
      if (res.ok) {
        setEditingServiceId(null);
        fetchData();
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteService = async (id) => {
    if (!confirm('Delete this service?')) return;
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      if (res.ok) fetchData();
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  if (!isAuthenticated && !isLoading) return null;
  if (isLoading) return <div style={{ padding: '4rem', color: '#fff', textAlign: 'center' }}>Loading Admin Panel...</div>;

  return (
    <div style={{ padding: '2rem', background: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '2px solid #E5B942', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '2px' }}>Admin <span style={{ color: '#E5B942' }}>Dashboard</span></h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={() => window.location.href = '/'}
            style={{ padding: '0.6rem 1.2rem', background: 'transparent', color: '#fff', border: '1px solid #444', borderRadius: '5px', cursor: 'pointer' }}
          >
            View Site
          </button>
          <button 
            onClick={handleLogout}
            style={{ padding: '0.6rem 1.2rem', background: '#ff4444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Add Category Form */}
        <div style={{ flex: 1, minWidth: '300px', background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Add New Tag/Category</h2>
          <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Category Name (e.g., Minimal, Cover up)</label>
              <input 
                type="text" 
                placeholder="Enter Name" 
                value={newCatName} 
                onChange={e => {
                  setNewCatName(e.target.value);
                  setNewCatId(e.target.value);
                }} 
                required
                style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #444', background: '#222', color: '#fff' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Category ID (Auto-generated)</label>
              <input 
                type="text" 
                placeholder="Enter ID" 
                value={newCatId.toLowerCase().replace(/\s+/g, '-')} 
                onChange={e => setNewCatId(e.target.value)} 
                required
                style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #444', background: '#222', color: '#fff' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '1rem' }}>
              Add Category
            </button>
          </form>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#aaa' }}>Current Tags:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {categories.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#333', padding: '0.6rem 1rem', borderRadius: '8px' }}>
                  {editingCatId === c.id ? (
                    <div style={{ display: 'flex', gap: '0.5rem', flexGrow: 1 }}>
                      <input 
                        type="text" 
                        value={editCatName} 
                        onChange={e => setEditCatName(e.target.value)} 
                        style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: '#fff', flexGrow: 1 }}
                      />
                      <button type="button" onClick={() => handleEditCategory(c.id)} style={{ background: 'var(--clr-gold)', color: '#000', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                      <button type="button" onClick={() => setEditingCatId(null)} style={{ background: '#555', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{c.name} <small style={{color: '#888', fontWeight: 'normal', marginLeft: '0.5rem'}}>({c.id})</small></span>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={() => { setEditingCatId(c.id); setEditCatName(c.name); }} style={{ background: 'transparent', color: 'var(--clr-gold)', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Edit</button>
                        <button type="button" onClick={() => handleDeleteCategory(c.id)} style={{ background: 'transparent', color: '#ff4444', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Image Form */}
        <div style={{ flex: 1, minWidth: '300px', background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Upload New Image</h2>
          <form onSubmit={handleAddImage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Select Tag/Category</label>
              <select 
                value={selectedCategory} 
                onChange={e => setSelectedCategory(e.target.value)} 
                required
                style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #444', background: '#222', color: '#fff' }}
              >
                <option value="">-- Choose Category --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Image File</label>
              <input 
                id="file-upload"
                type="file" 
                accept="image/*" 
                onChange={e => setFile(e.target.files[0])} 
                required
                style={{ padding: '0.5rem', background: '#222', borderRadius: '5px', border: '1px solid #444' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Title (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g., Black Rose Tattoo" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #444', background: '#222', color: '#fff' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Description (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g., Fine line work" 
                value={desc} 
                onChange={e => setDesc(e.target.value)} 
                style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #444', background: '#222', color: '#fff' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '1rem' }}>
              Upload Image
            </button>
          </form>
        </div>
      </div>

      <div style={{ marginTop: '4rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
        <h2 style={{ marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>Manage Gallery Images ({items.length})</h2>
        {items.length === 0 ? (
          <p style={{ color: '#aaa' }}>No images found.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {items.map(item => (
              <div key={item.id} style={{ background: '#222', borderRadius: '10px', overflow: 'hidden', border: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
                <img src={item.img} alt={item.alt} style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {editingImageId === item.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        value={editImageTitle} 
                        onChange={e => setEditImageTitle(e.target.value)} 
                        placeholder="Title"
                        style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff', fontSize: '0.9rem' }}
                      />
                      <input 
                        type="text" 
                        value={editImageDesc} 
                        onChange={e => setEditImageDesc(e.target.value)} 
                        placeholder="Description"
                        style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff', fontSize: '0.9rem' }}
                      />
                      <select 
                        value={editImageCat} 
                        onChange={e => setEditImageCat(e.target.value)} 
                        style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff', fontSize: '0.9rem' }}
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button onClick={() => handleEditImage(item.id)} style={{ flex: 1, background: 'var(--clr-gold)', color: '#000', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                        <button onClick={() => setEditingImageId(null)} style={{ flex: 1, background: '#555', color: '#fff', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--clr-gold)' }}>{item.title}</h4>
                        <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.85rem', color: '#ccc' }}>{item.desc || 'No description'}</p>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#888' }}>Tag: <span style={{ color: '#fff' }}>{item.category}</span></p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => {
                            setEditingImageId(item.id);
                            setEditImageTitle(item.title || '');
                            setEditImageDesc(item.desc || '');
                            setEditImageCat(item.category || '');
                          }}
                          style={{ flex: 1, background: 'transparent', color: 'var(--clr-gold)', border: '1px solid var(--clr-gold)', padding: '0.5rem', borderRadius: '5px', cursor: 'pointer', transition: '0.2s', fontWeight: 'bold' }}
                          onMouseOver={e => { e.target.style.background = 'var(--clr-gold)'; e.target.style.color = '#000'; }}
                          onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--clr-gold)'; }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteImage(item.id)}
                          style={{ flex: 1, background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '0.5rem', borderRadius: '5px', cursor: 'pointer', transition: '0.2s', fontWeight: 'bold' }}
                          onMouseOver={e => { e.target.style.background = '#ff4444'; e.target.style.color = '#fff'; }}
                          onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = '#ff4444'; }}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '4rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
        <h2 style={{ marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>Manage Services</h2>
        
        {/* Add Service Form */}
        <div style={{ background: '#222', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--clr-gold)' }}>Add New Service</h3>
          <form onSubmit={handleAddService} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Service Title" value={newServiceTitle} onChange={e => setNewServiceTitle(e.target.value)} required style={{ flex: 1, minWidth: '200px', padding: '0.8rem', borderRadius: '5px', border: '1px solid #444', background: '#333', color: '#fff' }} />
            <input type="text" placeholder="Description" value={newServiceDesc} onChange={e => setNewServiceDesc(e.target.value)} required style={{ flex: 2, minWidth: '300px', padding: '0.8rem', borderRadius: '5px', border: '1px solid #444', background: '#333', color: '#fff' }} />
            <input type="text" placeholder="Icon (Emoji)" value={newServiceIcon} onChange={e => setNewServiceIcon(e.target.value)} style={{ width: '120px', padding: '0.8rem', borderRadius: '5px', border: '1px solid #444', background: '#333', color: '#fff' }} />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Add Service</button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {services.map(service => (
            <div key={service.id} style={{ background: '#222', padding: '1.5rem', borderRadius: '10px', border: '1px solid #333' }}>
              {editingServiceId === service.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="text" value={editServiceTitle} onChange={e => setEditServiceTitle(e.target.value)} placeholder="Title" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff' }} />
                  <textarea value={editServiceDesc} onChange={e => setEditServiceDesc(e.target.value)} placeholder="Description" rows={2} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff' }} />
                  <input type="text" value={editServiceIcon} onChange={e => setEditServiceIcon(e.target.value)} placeholder="Icon (Emoji)" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff' }} />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => handleEditService(service.id)} style={{ background: 'var(--clr-gold)', color: '#000', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                    <button onClick={() => setEditingServiceId(null)} style={{ background: '#555', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ color: 'var(--clr-gold)', marginBottom: '0.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={!service.icon.startsWith('<svg') ? 'is-emoji' : ''} dangerouslySetInnerHTML={{ __html: service.icon }} style={{ width: '24px', height: '24px', display: 'inline-block' }}></span>
                      {service.title}
                    </h4>
                    <p style={{ color: '#ccc', fontSize: '0.9rem', maxWidth: '800px' }}>{service.desc}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => { setEditingServiceId(service.id); setEditServiceTitle(service.title); setEditServiceDesc(service.desc); setEditServiceIcon(service.icon); }} style={{ background: 'transparent', color: 'var(--clr-gold)', border: '1px solid var(--clr-gold)', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDeleteService(service.id)} style={{ background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '4rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
        <h2 style={{ marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>Manage Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p style={{ color: '#aaa' }}>No reviews found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map(review => (
              <div key={review.id} style={{ background: '#222', padding: '1.5rem', borderRadius: '10px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: 'var(--clr-gold)', marginBottom: '0.5rem' }}>{review.name} <span style={{ color: '#888', fontSize: '0.8rem', marginLeft: '10px' }}>{new Date(review.date).toLocaleDateString()}</span></h4>
                  <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>&quot;{review.comment}&quot;</p>
                  <div style={{ color: 'var(--clr-gold)', letterSpacing: '2px' }}>{'★'.repeat(review.rating || 5)}</div>
                </div>
                <button onClick={() => handleDeleteReview(review.id)} style={{ background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '0.6rem 1.2rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

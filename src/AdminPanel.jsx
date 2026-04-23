import React, { useState } from 'react';
import { motion } from 'framer-motion';

const COLLECTION_OPTIONS = [
  'Fruit Plants', 'Avenues', 'Flowers', 'Exotic Fruit Plants', 'Palm Varieties',
  'Spices', 'Indoor Plants', 'Shrubs & Bush', 'Bonsai', 'Climbers & Creepers',
  'Cactus & Succulents', 'Lawn Grass', 'Bamboo', 'Medicinal & Herbal Plants'
];

export default function AdminPanel({ 
  onClose, onLogout, 
  customPlants, setCustomPlants,
  testimonialEnabled, setTestimonialEnabled,
  customTestimonials, setCustomTestimonials,
  clientWorks, setClientWorks
}) {
  const [activeTab, setActiveTab] = useState('plants');

  // Plant form
  const [plantName, setPlantName] = useState('');
  const [plantDesc, setPlantDesc] = useState('');
  const [plantFamily, setPlantFamily] = useState('');
  const [plantCollection, setPlantCollection] = useState(COLLECTION_OPTIONS[0]);
  const [plantPrice, setPlantPrice] = useState('');
  const [plantStock, setPlantStock] = useState('');
  const [plantSpecs, setPlantSpecs] = useState('');
  const [plantImg, setPlantImg] = useState('');

  // Portfolio form (Works)
  const [workTitle, setWorkTitle] = useState('');
  const [workDesc, setWorkDesc] = useState('');
  const [workTag, setWorkTag] = useState('');
  const [workImg, setWorkImg] = useState('');

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPlant = (e) => {
    e.preventDefault();
    if (!plantName.trim()) return;
    const newPlant = {
      id: Date.now().toString(),
      name: plantName,
      desc: plantDesc,
      family: plantFamily,
      collection: plantCollection,
      price: plantPrice,
      stock: plantStock,
      specs: plantSpecs,
      img: plantImg,
      createdAt: new Date().toLocaleString()
    };
    const updated = [...customPlants, newPlant];
    setCustomPlants(updated);
    localStorage.setItem('admin_plants', JSON.stringify(updated));
    setPlantName(''); setPlantDesc(''); setPlantFamily(''); setPlantPrice(''); setPlantStock(''); setPlantSpecs(''); setPlantImg('');
  };

  const deletePlant = (id) => {
    const updated = customPlants.filter(p => p.id !== id);
    setCustomPlants(updated);
    localStorage.setItem('admin_plants', JSON.stringify(updated));
  };

  const addWork = (e) => {
    e.preventDefault();
    if (!workTitle.trim()) return;
    const newWork = {
      id: Date.now().toString(),
      title: workTitle,
      desc: workDesc,
      tag: workTag,
      img: workImg,
      createdAt: new Date().toLocaleString()
    };
    const updated = [...clientWorks, newWork];
    setClientWorks(updated);
    localStorage.setItem('client_works', JSON.stringify(updated));
    setWorkTitle(''); setWorkDesc(''); setWorkTag(''); setWorkImg('');
  };

  const deleteWork = (id) => {
    const updated = clientWorks.filter(w => w.id !== id);
    setClientWorks(updated);
    localStorage.setItem('client_works', JSON.stringify(updated));
  };

  const toggleTestimonial = () => {
    const newVal = !testimonialEnabled;
    setTestimonialEnabled(newVal);
    localStorage.setItem('testimonial_enabled', JSON.stringify(newVal));
  };

  const deleteTestimonial = (id) => {
    const updated = customTestimonials.filter(t => t.id !== id);
    setCustomTestimonials(updated);
    localStorage.setItem('custom_testimonials', JSON.stringify(updated));
  };

  return (
    <motion.div 
      className="admin-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div 
        className="admin-panel"
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-panel-header">
          <div>
            <h3 className="admin-panel-title">Admin Dashboard</h3>
            <p className="admin-panel-sub">Manage your nursery content</p>
          </div>
          <div className="admin-header-actions">
            <button className="admin-logout-btn" onClick={() => { onLogout(); onClose(); }}>Logout</button>
            <button className="admin-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'plants' ? 'active' : ''}`} onClick={() => setActiveTab('plants')}>
            🌿 Plants
          </button>
          <button className={`admin-tab ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>
            📁 Portfolio
          </button>
          <button className={`admin-tab ${activeTab === 'testimonials' ? 'active' : ''}`} onClick={() => setActiveTab('testimonials')}>
            💬 Reviews
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'plants' && (
            <>
              <div className="admin-form-section">
                <h4 className="admin-section-title">Add New Plant</h4>
                <form className="admin-form" onSubmit={addPlant}>
                  <div className="admin-form-row">
                    <div className="admin-field">
                      <label>Plant Name *</label>
                      <input type="text" value={plantName} onChange={(e) => setPlantName(e.target.value)} placeholder="e.g. Money Plant" required />
                    </div>
                    <div className="admin-field">
                      <label>Collection *</label>
                      <select value={plantCollection} onChange={(e) => setPlantCollection(e.target.value)}>
                        {COLLECTION_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="admin-field">
                    <label>Description</label>
                    <textarea value={plantDesc} onChange={(e) => setPlantDesc(e.target.value)} placeholder="Brief description..." rows="2"></textarea>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-field">
                      <label>Family</label>
                      <input type="text" value={plantFamily} onChange={(e) => setPlantFamily(e.target.value)} placeholder="e.g. Araceae" />
                    </div>
                    <div className="admin-field">
                      <label>Price (₹)</label>
                      <input type="text" value={plantPrice} onChange={(e) => setPlantPrice(e.target.value)} placeholder="e.g. 299" />
                    </div>
                    <div className="admin-field">
                      <label>Stock</label>
                      <input type="text" value={plantStock} onChange={(e) => setPlantStock(e.target.value)} placeholder="e.g. 10" />
                    </div>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-field">
                      <label>Light/Water Specs</label>
                      <input type="text" value={plantSpecs} onChange={(e) => setPlantSpecs(e.target.value)} placeholder="e.g. Moderate Sun | Weekly Water" />
                    </div>
                    <div className="admin-field">
                      <label>Plant Photo (Gallery)</label>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setPlantImg)} />
                    </div>
                  </div>
                  <button type="submit" className="admin-submit-btn">+ Add Plant</button>
                </form>
              </div>

              <div className="admin-list-section">
                <h4 className="admin-section-title">Added Plants ({customPlants.length})</h4>
                <div className="admin-plant-list">
                  {customPlants.map(plant => (
                    <div key={plant.id} className="admin-plant-item">
                      <div className="admin-plant-info">
                        <div className="admin-plant-name">{plant.name}</div>
                        <div className="admin-plant-meta">
                          <span className="admin-plant-tag">{plant.collection}</span>
                        </div>
                      </div>
                      <button className="admin-delete-btn" onClick={() => deletePlant(plant.id)}>🗑</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'portfolio' && (
            <>
              <div className="admin-form-section">
                <h4 className="admin-section-title">Add Work / Export</h4>
                <form className="admin-form" onSubmit={addWork}>
                  <div className="admin-field">
                    <label>Project Title *</label>
                    <input type="text" value={workTitle} onChange={(e) => setWorkTitle(e.target.value)} placeholder="e.g. Luxury Villa Landscaping" required />
                  </div>
                  <div className="admin-field">
                    <label>Description</label>
                    <textarea value={workDesc} onChange={(e) => setWorkDesc(e.target.value)} placeholder="Tell us about the project..." rows="2"></textarea>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-field">
                      <label>Category Tag</label>
                      <input type="text" value={workTag} onChange={(e) => setWorkTag(e.target.value)} placeholder="e.g. Landscaping / Export" />
                    </div>
                    <div className="admin-field">
                      <label>Project Photo (Gallery)</label>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setWorkImg)} />
                    </div>
                  </div>
                  <button type="submit" className="admin-submit-btn">+ Add Project</button>
                </form>
              </div>

              <div className="admin-list-section">
                <h4 className="admin-section-title">Showcased Works ({clientWorks.length})</h4>
                <div className="admin-plant-list">
                  {clientWorks.map(work => (
                    <div key={work.id} className="admin-plant-item">
                      <div className="admin-plant-info">
                        <div className="admin-plant-name">{work.title}</div>
                        <div className="admin-plant-tag">{work.tag}</div>
                      </div>
                      <button className="admin-delete-btn" onClick={() => deleteWork(work.id)}>🗑</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'testimonials' && (
            <>
              <div className="admin-form-section">
                <h4 className="admin-section-title">Settings</h4>
                <div className="admin-toggle-row">
                  <div>
                    <div className="admin-toggle-label">Allow Reviews</div>
                    <div className="admin-toggle-desc">Toggle the "Add Testimonial" button.</div>
                  </div>
                  <button className={`admin-toggle ${testimonialEnabled ? 'active' : ''}`} onClick={toggleTestimonial}>
                    <span className="admin-toggle-knob"></span>
                  </button>
                </div>
              </div>

              <div className="admin-list-section">
                <h4 className="admin-section-title">Customer Reviews ({customTestimonials.length})</h4>
                <div className="admin-plant-list">
                  {customTestimonials.map(t => (
                    <div key={t.id} className="admin-plant-item">
                      <div className="admin-plant-info">
                        <div className="admin-plant-name">{t.name}</div>
                        <div className="admin-plant-desc">"{t.text}"</div>
                      </div>
                      <button className="admin-delete-btn" onClick={() => deleteTestimonial(t.id)}>🗑</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

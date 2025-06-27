import React, { useState, useEffect } from 'react';
import './Actors.css';

const Actors = () => {
  const [actors, setActors] = useState([]);
  const [filteredActors, setFilteredActors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActor, setSelectedActor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [actorsPerPage] = useState(6);

  // Mock data cho diễn viên
  const mockActors = [
    {
      id: 1,
      name: 'Chris Evans',
      email: 'chris.evans@email.com',
      phone: '+1 555-0101',
      birthDate: '1981-06-13',
      nationality: 'American',
      avatar: 'https://via.placeholder.com/150x150/4a90e2/ffffff?text=CE',
      knownFor: 'Captain America',
      biography: 'Christopher Robert Evans is an American actor, best known for his role as Captain America in the Marvel Cinematic Universe.',
      movies: ['Captain America: The First Avenger', 'Avengers: Endgame', 'The Gray Man'],
      awards: 8,
      status: 'active',
      joinDate: '2010-03-15'
    },
    {
      id: 2,
      name: 'Chris Hemsworth',
      email: 'chris.hemsworth@email.com',
      phone: '+61 400-000-001',
      birthDate: '1983-08-11',
      nationality: 'Australian',
      avatar: 'https://via.placeholder.com/150x150/50c878/ffffff?text=CH',
      knownFor: 'Thor',
      biography: 'Christopher Hemsworth is an Australian actor best known for playing Thor in the Marvel Cinematic Universe.',
      movies: ['Thor', 'Avengers: Infinity War', 'Extraction'],
      awards: 6,
      status: 'active',
      joinDate: '2011-05-06'
    },
    {
      id: 3,
      name: 'Robert Downey Jr.',
      email: 'robert.downey@email.com',
      phone: '+1 555-0102',
      birthDate: '1965-04-04',
      nationality: 'American',
      avatar: 'https://via.placeholder.com/150x150/ff6b6b/ffffff?text=RD',
      knownFor: 'Iron Man',
      biography: 'Robert John Downey Jr. is an American actor and producer known for his role as Iron Man in the Marvel Cinematic Universe.',
      movies: ['Iron Man', 'Avengers: Endgame', 'Sherlock Holmes'],
      awards: 12,
      status: 'active',
      joinDate: '2008-05-02'
    },
    {
      id: 4,
      name: 'Scarlett Johansson',
      email: 'scarlett.johansson@email.com',
      phone: '+1 555-0103',
      birthDate: '1984-11-22',
      nationality: 'American',
      avatar: 'https://via.placeholder.com/150x150/9b59b6/ffffff?text=SJ',
      knownFor: 'Black Widow',
      biography: 'Scarlett Ingrid Johansson is an American actress known for her role as Black Widow in the Marvel Cinematic Universe.',
      movies: ['Black Widow', 'Avengers: Endgame', 'Marriage Story'],
      awards: 5,
      status: 'active',
      joinDate: '2010-05-07'
    },
    {
      id: 5,
      name: 'Anthony Mackie',
      email: 'anthony.mackie@email.com',
      phone: '+1 555-0104',
      birthDate: '1978-09-23',
      nationality: 'American',
      avatar: 'https://via.placeholder.com/150x150/f39c12/ffffff?text=AM',
      knownFor: 'Falcon',
      biography: 'Anthony Dwane Mackie is an American actor known for his role as Falcon in the Marvel Cinematic Universe.',
      movies: ['The Falcon and the Winter Soldier', 'Avengers: Endgame', 'Altered Carbon'],
      awards: 4,
      status: 'active',
      joinDate: '2014-04-04'
    },
    {
      id: 6,
      name: 'Mark Ruffalo',
      email: 'mark.ruffalo@email.com',
      phone: '+1 555-0105',
      birthDate: '1967-11-22',
      nationality: 'American',
      avatar: 'https://via.placeholder.com/150x150/2ecc71/ffffff?text=MR',
      knownFor: 'Hulk',
      biography: 'Mark Alan Ruffalo is an American actor and filmmaker known for his role as Hulk in the Marvel Cinematic Universe.',
      movies: ['Avengers: Endgame', 'Thor: Ragnarok', 'Spotlight'],
      awards: 7,
      status: 'inactive',
      joinDate: '2012-05-04'
    }
  ];

  useEffect(() => {
    setActors(mockActors);
    setFilteredActors(mockActors);
  }, []);

  useEffect(() => {
    const filtered = actors.filter(actor =>
      actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actor.knownFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actor.nationality.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredActors(filtered);
    setCurrentPage(1);
  }, [searchTerm, actors]);

  // Pagination
  const indexOfLastActor = currentPage * actorsPerPage;
  const indexOfFirstActor = indexOfLastActor - actorsPerPage;
  const currentActors = filteredActors.slice(indexOfFirstActor, indexOfLastActor);
  const totalPages = Math.ceil(filteredActors.length / actorsPerPage);

  const handleView = (actor) => {
    setSelectedActor(actor);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (actor) => {
    setSelectedActor(actor);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (actorId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa diễn viên này?')) {
      setActors(actors.filter(actor => actor.id !== actorId));
    }
  };

  const handleAddNew = () => {
    setSelectedActor({
      id: Date.now(),
      name: '',
      email: '',
      phone: '',
      birthDate: '',
      nationality: '',
      avatar: 'https://via.placeholder.com/150x150/cccccc/ffffff?text=NEW',
      knownFor: '',
      biography: '',
      movies: [],
      awards: 0,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = (actorData) => {
    if (actors.find(a => a.id === actorData.id)) {
      // Update existing
      setActors(actors.map(actor => 
        actor.id === actorData.id ? { ...actorData } : actor
      ));
    } else {
      // Add new
      setActors([...actors, actorData]);
    }
    setShowModal(false);
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge ${status}`}>
        {status === 'active' ? 'Đang hoạt động' : 'Tạm nghỉ'}
      </span>
    );
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="actors-container">
      <div className="actors-header">
        <div className="header-left">
          <h1>Quản lý Diễn viên</h1>
          <p>Tổng cộng: {filteredActors.length} diễn viên</p>
        </div>
        <button className="btn-primary" onClick={handleAddNew}>
          <i className="fas fa-plus"></i>
          Thêm diễn viên mới
        </button>
      </div>

      <div className="actors-controls">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Tìm kiếm diễn viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-controls">
          <select className="filter-select">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Tạm nghỉ</option>
          </select>
        </div>
      </div>

      <div className="actors-grid">
        {currentActors.map(actor => (
          <div key={actor.id} className="actor-card">
            <div className="actor-avatar">
              <img src={actor.avatar} alt={actor.name} />
              {getStatusBadge(actor.status)}
            </div>
            <div className="actor-info">
              <h3>{actor.name}</h3>
              <p className="actor-role">{actor.knownFor}</p>
              <p className="actor-nationality">{actor.nationality}</p>
              <div className="actor-stats">
                <span><i className="fas fa-calendar"></i> {calculateAge(actor.birthDate)} tuổi</span>
                <span><i className="fas fa-trophy"></i> {actor.awards} giải</span>
                <span><i className="fas fa-film"></i> {actor.movies.length} phim</span>
              </div>
            </div>
            <div className="actor-actions">
              <button 
                className="btn-view" 
                onClick={() => handleView(actor)}
                title="Xem chi tiết"
              >
                <i className="fas fa-eye"></i>
              </button>
              <button 
                className="btn-edit" 
                onClick={() => handleEdit(actor)}
                title="Chỉnh sửa"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button 
                className="btn-delete" 
                onClick={() => handleDelete(actor.id)}
                title="Xóa"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn-pagination"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn-pagination ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn-pagination"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ActorModal 
          actor={selectedActor}
          isEditing={isEditing}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

// Actor Modal Component
const ActorModal = ({ actor, isEditing, onClose, onSave }) => {
  const [formData, setFormData] = useState(actor);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMoviesChange = (e) => {
    const movies = e.target.value.split(',').map(movie => movie.trim()).filter(movie => movie);
    setFormData(prev => ({
      ...prev,
      movies
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Chỉnh sửa diễn viên' : 'Chi tiết diễn viên'}</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label>Tên diễn viên *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Ngày sinh</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quốc tịch</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Nổi tiếng với vai</label>
              <input
                type="text"
                name="knownFor"
                value={formData.knownFor}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Số giải thưởng</label>
              <input
                type="number"
                name="awards"
                value={formData.awards}
                onChange={handleChange}
                disabled={!isEditing}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Tạm nghỉ</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Tiểu sử</label>
            <textarea
              name="biography"
              value={formData.biography}
              onChange={handleChange}
              disabled={!isEditing}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Phim tham gia (phân cách bằng dấu phẩy)</label>
            <textarea
              value={formData.movies.join(', ')}
              onChange={handleMoviesChange}
              disabled={!isEditing}
              rows="3"
            />
          </div>

          {isEditing && (
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="btn-primary">
                Lưu thay đổi
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Actors;

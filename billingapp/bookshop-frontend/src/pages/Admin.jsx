import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, BookOpen, BarChart3, Settings, Plus, Edit, Trash2, Search, Eye, ShoppingCart } from 'lucide-react';
import { itemsAPI, customersAPI, cartAPI } from '../services/api';
import toast from 'react-hot-toast';
import AdminNavbar from '../components/AdminNavbar';

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerModalType, setCustomerModalType] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [customerCartItems, setCustomerCartItems] = useState([]);

  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
    language: '',
    bookType: ''
  });

  const [customerForm, setCustomerForm] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    role: 'CUSTOMER'
  });

  useEffect(() => {
    if (activeTab === 'customers') {
      fetchCustomers();
    } else if (activeTab === 'items') {
      fetchItems();
    }
  }, [activeTab]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customersAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await itemsAPI.getAll();
      console.log('Admin API Response:', response.data); // Debug log
      
      // Handle Spring Data Page response structure
      let itemsData = [];
      if (response.data) {
        if (response.data.content) {
          // Spring Data Page object
          itemsData = response.data.content;
        } else if (Array.isArray(response.data)) {
          // Direct array response
          itemsData = response.data;
        } else {
          console.warn('Unexpected response structure:', response.data);
          itemsData = [];
        }
      }
      
      setItems(itemsData);
      
      if (itemsData.length === 0) {
        toast('No items found. Create your first item below.', {
          icon: 'ℹ️',
        });
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      if (error.code === 'ECONNREFUSED') {
        toast.error('Unable to connect to server. Please check if the backend is running.');
      } else if (error.response?.status === 401) {
        toast.error('Authentication required. Please log in.');
      } else {
        toast.error(`Failed to load items: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        await itemsAPI.update(editingItem.id, itemForm);
        toast.success('Item updated successfully');
      } else {
        await itemsAPI.create(itemForm);
        toast.success('Item created successfully');
      }
      setShowModal(false);
      setEditingItem(null);
      setItemForm({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '', language: '', bookType: '' });
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemsAPI.delete(id);
        toast.success('Item deleted successfully');
        fetchItems();
      } catch (error) {
        toast.error('Error deleting item');
      }
    }
  };

  const openItemModal = (item = null) => {
    setModalType('item');
    setEditingItem(item);
    if (item) {
      setItemForm({
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        stock: item.stock.toString(),
        category: item.category || '',
        imageUrl: item.imageUrl || '',
        language: item.language || '',
        bookType: item.bookType || ''
      });
    } else {
      setItemForm({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '', language: '', bookType: '' });
    }
    setImagePreview(item?.imageUrl || '');
    setShowModal(true);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Customer management functions
  const openCustomerModal = (customer = null, type = 'create') => {
    setCustomerModalType(type);
    if (customer) {
      setSelectedCustomer(customer);
      setCustomerForm({
        username: customer.username || '',
        email: customer.email || '',
        fullName: customer.fullName || customer.name || '',
        phone: customer.phone || '',
        role: customer.role || 'CUSTOMER'
      });
    } else {
      setSelectedCustomer(null);
      setCustomerForm({
        username: '',
        email: '',
        fullName: '',
        phone: '',
        role: 'CUSTOMER'
      });
    }
    setShowCustomerModal(true);
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (customerModalType === 'edit' && selectedCustomer) {
        await customersAPI.update(selectedCustomer.id, customerForm);
        toast.success('Customer updated successfully');
      } else {
        await customersAPI.create(customerForm);
        toast.success('Customer created successfully');
      }
      setShowCustomerModal(false);
      fetchCustomers();
    } catch (error) {
      toast.error(customerModalType === 'edit' ? 'Error updating customer' : 'Error creating customer');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customersAPI.delete(id);
        toast.success('Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        toast.error('Error deleting customer');
      }
    }
  };

  const fetchCustomerCartItems = async (customerId) => {
    try {
      const response = await cartAPI.getByUserId(customerId);
      setCustomerCartItems(response.data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCustomerCartItems([]);
    }
  };

  const viewCustomerDetails = async (customer) => {
    setSelectedCustomer(customer);
    setCustomerModalType('view');
    setShowCustomerModal(true);
    // Fetch cart items for this customer
    await fetchCustomerCartItems(customer.id);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/v1/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setItemForm({ ...itemForm, imageUrl: data.url });
      setImagePreview(data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  if (user?.role !== 'ADMIN' && user?.role !== 'STAFF') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin or staff privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your bookshop operations</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 className="h-5 w-5 inline mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('items')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'items'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookOpen className="h-5 w-5 inline mr-2" />
                Items
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'customers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="h-5 w-5 inline mr-2" />
                Customers
              </button>
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Books</p>
                  <p className="text-2xl font-semibold text-gray-900">{items.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-semibold text-gray-900">{customers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {items.filter(item => item.stock < 10).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Items Management</h2>
                <button
                  onClick={() => openItemModal()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openItemModal(item)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Customers Management</h2>
                <button
                  onClick={() => openCustomerModal()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Customer
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.id}
                      </td>
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                        onClick={() => viewCustomerDetails(customer)}
                      >
                        {customer.name || customer.fullName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          customer.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 
                          customer.role === 'STAFF' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {customer.role || 'CUSTOMER'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => viewCustomerDetails(customer)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openCustomerModal(customer, 'edit')}
                          className="text-green-600 hover:text-green-900 mr-3"
                          title="Edit Customer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Customer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h3>
                <form onSubmit={handleItemSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={itemForm.name}
                      onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={itemForm.description}
                      onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      value={itemForm.language}
                      onChange={(e) => setItemForm({ ...itemForm, language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Language</option>
                      <option value="English">English</option>
                      <option value="Sinhala">Sinhala</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Russian">Russian</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Book Type
                    </label>
                    <select
                      value={itemForm.bookType}
                      onChange={(e) => setItemForm({ ...itemForm, bookType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Book Type</option>
                      <optgroup label="Fiction">
                        <option value="Novel">Novel</option>
                        <option value="Short Story">Short Story</option>
                        <option value="Poetry">Poetry</option>
                        <option value="Drama">Drama</option>
                      </optgroup>
                      <optgroup label="Non-Fiction">
                        <option value="Biography">Biography</option>
                        <option value="History">History</option>
                        <option value="Science">Science</option>
                        <option value="Self-Help">Self-Help</option>
                        <option value="Business">Business</option>
                        <option value="Health">Health</option>
                        <option value="Travel">Travel</option>
                      </optgroup>
                      <optgroup label="Educational">
                        <option value="Textbook">Textbook</option>
                        <option value="Reference">Reference</option>
                        <option value="Academic">Academic</option>
                      </optgroup>
                      <optgroup label="Children">
                        <option value="Children's Fiction">Children's Fiction</option>
                        <option value="Picture Book">Picture Book</option>
                        <option value="Young Adult">Young Adult</option>
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category (Optional)
                    </label>
                    <input
                      type="text"
                      value={itemForm.category}
                      onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Bestseller, Award Winner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Book Image
                    </label>
                    <div className="space-y-3">
                      {imagePreview && (
                        <div className="flex justify-center">
                          <img
                            src={imagePreview}
                            alt="Book preview"
                            className="w-24 h-32 object-cover rounded-md border border-gray-300"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      />
                      {uploading && (
                        <p className="text-sm text-blue-600">Uploading image...</p>
                      )}
                      <input
                        type="text"
                        placeholder="Or enter image URL directly"
                        value={itemForm.imageUrl}
                        onChange={(e) => {
                          setItemForm({ ...itemForm, imageUrl: e.target.value });
                          setImagePreview(e.target.value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={itemForm.price}
                      onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      required
                      value={itemForm.stock}
                      onChange={(e) => setItemForm({ ...itemForm, stock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Customer Modal */}
        {showCustomerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {customerModalType === 'view' ? 'Customer Details' : 
                 customerModalType === 'edit' ? 'Edit Customer' : 'Add Customer'}
              </h2>
              
              {customerModalType === 'view' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                      <p className="text-sm text-gray-900">{selectedCustomer?.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <p className="text-sm text-gray-900">{selectedCustomer?.username || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <p className="text-sm text-gray-900">{selectedCustomer?.fullName || selectedCustomer?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-sm text-gray-900">{selectedCustomer?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-sm text-gray-900">{selectedCustomer?.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedCustomer?.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 
                        selectedCustomer?.role === 'STAFF' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedCustomer?.role || 'CUSTOMER'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Cart Items Section */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Cart Items ({customerCartItems.length})
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {customerCartItems.length > 0 ? (
                        <div className="space-y-3">
                          {customerCartItems.map((cartItem, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={cartItem.item?.imageUrl || cartItem.imageUrl || 'https://via.placeholder.com/50'} 
                                  alt={cartItem.item?.name || cartItem.name || 'Item'}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {cartItem.item?.name || cartItem.name || 'Unknown Item'}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    Quantity: {cartItem.quantity || 1}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  ${((cartItem.item?.price || cartItem.price || 0) * (cartItem.quantity || 1)).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ${(cartItem.item?.price || cartItem.price || 0).toFixed(2)} each
                                </p>
                              </div>
                            </div>
                          ))}
                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center font-semibold">
                              <span>Total:</span>
                              <span className="text-lg">
                                ${customerCartItems.reduce((total, item) => 
                                  total + ((item.item?.price || item.price || 0) * (item.quantity || 1)), 0
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600">No items in cart</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowCustomerModal(false)}
                      className="px-4 py-2 text-gray-500 hover:text-gray-700"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => openCustomerModal(selectedCustomer, 'edit')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Edit Customer
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCustomerSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerForm.username}
                        onChange={(e) => setCustomerForm({ ...customerForm, username: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerForm.fullName}
                        onChange={(e) => setCustomerForm({ ...customerForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerForm.email}
                        onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={customerForm.role}
                        onChange={(e) => setCustomerForm({ ...customerForm, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="STAFF">Staff</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCustomerModal(false)}
                      className="px-4 py-2 text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (customerModalType === 'edit' ? 'Update' : 'Create')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default Admin;

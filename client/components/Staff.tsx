
'use client';

import { useState } from 'react';

interface StaffMember {
  id: string;
  staffId: string;
  name: string;
  age: number;
  gender: string;
  designation: string;
  joiningDate: string;
  resignedDate?: string;
  joiningDate2?: string;
  resignedDate2?: string;
  joiningDate3?: string;
  resignedDate3?: string;
  joiningDate4?: string;
  resignedDate4?: string;
  joiningDate5?: string;
  resignedDate5?: string;
  joiningDate6?: string;
  resignedDate6?: string;
  joiningDate7?: string;
  resignedDate7?: string;
  joiningDate8?: string;
  resignedDate8?: string;
  introducer: string;
  introducerId: string;
  mobileNo: string;
  status: 'Active' | 'Resigned';
  address: {
    doorNo: string;
    street: string;
    area: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    country: string;
  };
  createdBy?: string;
  createdAt?: string;
}

interface AddModalProps {
  onSave: (staff: Omit<StaffMember, 'id'>) => void;
  onClose: () => void;
  currentUser: string;
}

interface EditModalProps {
  staff: StaffMember;
  onSave: (staff: StaffMember) => void;
  onClose: () => void;
  userRole: string;
}

function AddModal({ onSave, onClose, currentUser }: AddModalProps) {
  const [formData, setFormData] = useState({
    staffId: '',
    name: '',
    age: 18,
    gender: 'Male',
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    resignedDate: '',
    joiningDate2: '',
    resignedDate2: '',
    joiningDate3: '',
    resignedDate3: '',
    joiningDate4: '',
    resignedDate4: '',
    joiningDate5: '',
    resignedDate5: '',
    joiningDate6: '',
    resignedDate6: '',
    joiningDate7: '',
    resignedDate7: '',
    joiningDate8: '',
    resignedDate8: '',
    introducer: '',
    introducerId: '',
    mobileNo: '',
    status: 'Active' as const,
    address: {
      doorNo: '',
      street: '',
      area: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      country: 'India',
    },
  });

  const genders = ['Male', 'Female', 'Other'];
  const statuses = ['Active', 'Resigned'] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.staffId.trim() && formData.name.trim() && formData.designation.trim()) {
      onSave({
        ...formData,
        createdBy: currentUser,
        createdAt: new Date().toISOString(),
      });
      onClose();
    }
  };

  const handleAddressChange = (field: keyof typeof formData.address, value: string) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [field]: value,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add New Staff Member</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
                <input
                  type="text"
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="18"
                    max="65"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={formData.mobileNo}
                  onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  pattern="[0-9]{10}"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Introducer</label>
                <input
                  type="text"
                  value={formData.introducer}
                  onChange={(e) => setFormData({ ...formData, introducer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Introducer ID</label>
                <input
                  type="text"
                  value={formData.introducerId}
                  onChange={(e) => setFormData({ ...formData, introducerId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Resigned' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Employment History */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 sticky top-0 bg-white">Employment History</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date 1</label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resign Date 1</label>
                  <input
                    type="date"
                    value={formData.resignedDate}
                    onChange={(e) => setFormData({ ...formData, resignedDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date 2</label>
                  <input
                    type="date"
                    value={formData.joiningDate2}
                    onChange={(e) => setFormData({ ...formData, joiningDate2: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resign Date 2</label>
                  <input
                    type="date"
                    value={formData.resignedDate2}
                    onChange={(e) => setFormData({ ...formData, resignedDate2: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date 3</label>
                  <input
                    type="date"
                    value={formData.joiningDate3}
                    onChange={(e) => setFormData({ ...formData, joiningDate3: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resign Date 3</label>
                  <input
                    type="date"
                    value={formData.resignedDate3}
                    onChange={(e) => setFormData({ ...formData, resignedDate3: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date 4</label>
                  <input
                    type="date"
                    value={formData.joiningDate4}
                    onChange={(e) => setFormData({ ...formData, joiningDate4: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resign Date 4</label>
                  <input
                    type="date"
                    value={formData.resignedDate4}
                    onChange={(e) => setFormData({ ...formData, resignedDate4: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date 5</label>
                  <input
                    type="date"
                    value={formData.joiningDate5}
                    onChange={(e) => setFormData({ ...formData, joiningDate5: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resign Date 5</label>
                  <input
                    type="date"
                    value={formData.resignedDate5}
                    onChange={(e) => setFormData({ ...formData, resignedDate5: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date 6</label>
                  <input
                    type="date"
                    value={formData.joiningDate6}
                    onChange={(e) => setFormData({ ...formData, joiningDate6: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resign Date 6</label>
                  <input
                    type="date"
                    value={formData.resignedDate6}
                    onChange={(e) => setFormData({ ...formData, resignedDate6: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date 7</label>
                  <input
                    type="date"
                    value={formData.joiningDate7}
                    onChange={(e) => setFormData({ ...formData, joiningDate7: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resign Date 7</label>
                  <input
                    type="date"
                    value={formData.resignedDate7}
                    onChange={(e) => setFormData({ ...formData, resignedDate7: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date 8</label>
                  <input
                    type="date"
                    value={formData.joiningDate8}
                    onChange={(e) => setFormData({ ...formData, joiningDate8: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resign Date 8</label>
                  <input
                    type="date"
                    value={formData.resignedDate8}
                    onChange={(e) => setFormData({ ...formData, resignedDate8: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Address Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Door No./Flat No.</label>
                  <input
                    type="text"
                    value={formData.address.doorNo}
                    onChange={(e) => handleAddressChange('doorNo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123, A-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Main Street"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area/Locality</label>
                <input
                  type="text"
                  value={formData.address.area}
                  onChange={(e) => handleAddressChange('area', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Gandhi Nagar"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Bangalore"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <input
                    type="text"
                    value={formData.address.district}
                    onChange={(e) => handleAddressChange('district', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Bangalore Urban"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Karnataka"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.address.pincode}
                    onChange={(e) => handleAddressChange('pincode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="560001"
                    pattern="[0-9]{6}"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.address.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
            >
              Add Staff
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditModal({ staff, onSave, onClose, userRole }: EditModalProps) {
  const [formData, setFormData] = useState(staff);

  const genders = ['Male', 'Female', 'Other'];
  const statuses = ['Active', 'Resigned'] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleAddressChange = (field: keyof typeof formData.address, value: string) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [field]: value,
      },
    });
  };

  const isReadOnly = userRole === 'User';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{isReadOnly ? 'View Staff Details' : 'Edit Staff Member'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
                <input
                  type="text"
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isReadOnly}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isReadOnly}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                    min="18"
                    max="65"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    disabled={isReadOnly}
                  >
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isReadOnly}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={formData.mobileNo}
                  onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isReadOnly}
                  pattern="[0-9]{10}"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Introducer</label>
                <input
                  type="text"
                  value={formData.introducer}
                  onChange={(e) => setFormData({ ...formData, introducer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Introducer ID</label>
                <input
                  type="text"
                  value={formData.introducerId}
                  onChange={(e) => setFormData({ ...formData, introducerId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isReadOnly}
                />
              </div>
              {formData.createdBy && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                  <input
                    type="text"
                    value={formData.createdBy}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    disabled
                  />
                </div>
              )}
            </div>

            {/* Employment History */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 sticky top-0 bg-white">Employment History</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date 1</label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resign Date 1</label>
                  <input
                    type="date"
                    value={formData.resignedDate || ''}
                    onChange={(e) => setFormData({ ...formData, resignedDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date 2</label>
                  <input
                    type="date"
                    value={formData.joiningDate2 || ''}
                    onChange={(e) => setFormData({ ...formData, joiningDate2: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resign Date 2</label>
                  <input
                    type="date"
                    value={formData.resignedDate2 || ''}
                    onChange={(e) => setFormData({ ...formData, resignedDate2: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline_none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date 3</label>
                  <input
                    type="date"
                    value={formData.joiningDate3 || ''}
                    onChange={(e) => setFormData({ ...formData, joiningDate3: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resign Date 3</label>
                  <input
                    type="date"
                    value={formData.resignedDate3 || ''}
                    onChange={(e) => setFormData({ ...formData, resignedDate3: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date 4</label>
                  <input
                    type="date"
                    value={formData.joiningDate4 || ''}
                    onChange={(e) => setFormData({ ...formData, joiningDate4: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resign Date 4</label>
                  <input
                    type="date"
                    value={formData.resignedDate4 || ''}
                    onChange={(e) => setFormData({ ...formData, resignedDate4: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date 5</label>
                  <input
                    type="date"
                    value={formData.joiningDate5 || ''}
                    onChange={(e) => setFormData({ ...formData, joiningDate5: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resign Date 5</label>
                  <input
                    type="date"
                    value={formData.resignedDate5 || ''}
                    onChange={(e) => setFormData({ ...formData, resignedDate5: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date 6</label>
                  <input
                    type="date"
                    value={formData.joiningDate6 || ''}
                    onChange={(e) => setFormData({ ...formData, joiningDate6: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resign Date 6</label>
                  <input
                    type="date"
                    value={formData.resignedDate6 || ''}
                    onChange={(e) => setFormData({ ...formData, resignedDate6: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date 7</label>
                  <input
                    type="date"
                    value={formData.joiningDate7 || ''}
                    onChange={(e) => setFormData({ ...formData, joiningDate7: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resign Date 7</label>
                  <input
                    type="date"
                    value={formData.resignedDate7 || ''}
                    onChange={(e) => setFormData({ ...formData, resignedDate7: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date 8</label>
                  <input
                    type="date"
                    value={formData.joiningDate8 || ''}
                    onChange={(e) => setFormData({ ...formData, joiningDate8: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resign Date 8</label>
                  <input
                    type="date"
                    value={formData.resignedDate8 || ''}
                    onChange={(e) => setFormData({ ...formData, resignedDate8: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Address Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Door No./Flat No.</label>
                  <input
                    type="text"
                    value={formData.address.doorNo}
                    onChange={(e) => handleAddressChange('doorNo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                    placeholder="123, A-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                    placeholder="Main Street"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area/Locality</label>
                <input
                  type="text"
                  value={formData.address.area}
                  onChange={(e) => handleAddressChange('area', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isReadOnly}
                  placeholder="Gandhi Nagar"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                    placeholder="Bangalore"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <input
                    type="text"
                    value={formData.address.district}
                    onChange={(e) => handleAddressChange('district', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                    placeholder="Bangalore Urban"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                    placeholder="Karnataka"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.address.pincode}
                    onChange={(e) => handleAddressChange('pincode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isReadOnly}
                    placeholder="560001"
                    pattern="[0-9]{6}"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.address.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {!isReadOnly && (
            <div className="flex gap-2 mt-6">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap"
              >
                Save Changes
              </button>
            </div>
          )}
          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer whitespace-nowrap"
            >
              {isReadOnly ? 'Close' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface StaffProps {
  userRole: string;
  currentUser: string;
  onLogAction: (action: string, details: string) => void;
}

export default function Staff({ userRole, currentUser, onLogAction }: StaffProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [activeView, setActiveView] = useState<'active' | 'all'>('active');
  const [staff, setStaff] = useState<StaffMember[]>([]);


  const activeStaff = staff.filter((s) => s.status === 'Active');
  const resignedStaff = staff.filter((s) => s.status === 'Resigned');

  const displayedStaff = activeView === 'active' ? activeStaff : staff;

  const handleAddStaff = (newStaff: Omit<StaffMember, 'id'>) => {
    if (userRole === 'User') {
      alert('Users cannot add staff members');
      return;
    }

    const staffMember: StaffMember = {
      ...newStaff,
      id: Date.now().toString(),
    };
    setStaff([...staff, staffMember]);
    onLogAction('Add Staff', `Added new staff member: ${newStaff.name} (${newStaff.staffId})`);
  };

  const handleEdit = (staffMember: StaffMember) => {
    setEditingStaff(staffMember);
    onLogAction('View Staff', `Accessed staff details: ${staffMember.name} (${staffMember.staffId})`);
  };

  const handleSave = (updatedStaff: StaffMember) => {
    setStaff(staff.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
    onLogAction('Edit Staff', `Modified staff details: ${updatedStaff.name} (${updatedStaff.staffId})`);
  };

  const handleStatusChange = (id: string, newStatus: 'Active' | 'Resigned') => {
    if (userRole === 'User') {
      alert('Users cannot modify staff status');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const updatedStaff = staff.map((member) =>
      member.id === id
        ? { ...member, status: newStatus, resignedDate: newStatus === 'Resigned' ? today : undefined }
        : member,
    );
    setStaff(updatedStaff);

    const staffMember = staff.find((s) => s.id === id);
    onLogAction('Change Staff Status', `Changed ${staffMember?.name} status to ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    if (userRole === 'Manager' || userRole === 'User') {
      alert(`${userRole}s cannot delete staff members`);
      return;
    }

    if (confirm('Are you sure you want to delete this staff member?')) {
      const staffMember = staff.find((s) => s.id === id);
      setStaff(staff.filter((member) => member.id !== id));
      onLogAction('Delete Staff', `Deleted staff member: ${staffMember?.name} (${staffMember?.staffId})`);
    }
  };

  const exportToExcel = () => {
    const staffToExport = activeView === 'active' ? activeStaff : staff;
    const headers = [
      'S.No',
      'Staff ID',
      'Name',
      'Age',
      'Gender',
      'Designation',
      'Mobile No',
      'Join Date 1',
      'Resign Date 1',
      'Join Date 2',
      'Resign Date 2',
      'Join Date 3',
      'Resign Date 3',
      'Join Date 4',
      'Resign Date 4',
      'Join Date 5',
      'Resign Date 5',
      'Join Date 6',
      'Resign Date 6',
      'Join Date 7',
      'Resign Date 7',
      'Join Date 8',
      'Resign Date 8',
      'Status',
      'Introducer',
      'Introducer ID',
      'Door No',
      'Street',
      'Area',
      'City',
      'District',
      'State',
      'Pincode',
      'Country',
      'Created By',
    ];

    const csvContent = [
      headers.join(','),
      ...staffToExport.map((member, index) => [
        index + 1,
        member.staffId,
        member.name,
        member.age,
        member.gender,
        member.designation,
        member.mobileNo,
        member.joiningDate,
        member.resignedDate || '',
        member.joiningDate2 || '',
        member.resignedDate2 || '',
        member.joiningDate3 || '',
        member.resignedDate3 || '',
        member.joiningDate4 || '',
        member.resignedDate4 || '',
        member.joiningDate5 || '',
        member.resignedDate5 || '',
        member.joiningDate6 || '',
        member.resignedDate6 || '',
        member.joiningDate7 || '',
        member.resignedDate7 || '',
        member.joiningDate8 || '',
        member.resignedDate8 || '',
        member.status,
        member.introducer,
        member.introducerId,
        member.address.doorNo,
        member.address.street,
        member.address.area,
        member.address.city,
        member.address.district,
        member.address.state,
        member.address.pincode,
        member.address.country,
        member.createdBy || '',
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `staff_${activeView}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onLogAction('Export Staff', `Exported ${activeView} staff data to Excel`);
  };

  const getFullAddress = (address: StaffMember['address']) => {
    const parts = [
      address.doorNo,
      address.street,
      address.area,
      address.city,
      address.district,
      address.state,
      address.pincode,
      address.country,
    ].filter((part) => part && part.trim());

    return parts.join(', ');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <div className="flex gap-2">
            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <i className="ri-file-excel-2-line w-4 h-4 flex items-center justify-center"></i>
              Export
            </button>
            {userRole !== 'User' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2"
              >
                <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
                Add New Staff
              </button>
            )}
          </div>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveView('active')}
            className={`px-4 py-2 rounded-md transition duration-200 cursor-pointer whitespace-nowrap ${
              activeView === 'active'
                ? 'bg-white text-blue-600 shadow-sm font-medium'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Active Staff
          </button>
          <button
            onClick={() => setActiveView('all')}
            className={`px-4 py-2 rounded-md transition duration-200 cursor-pointer whitespace-nowrap ${
              activeView === 'all'
                ? 'bg-white text-blue-600 shadow-sm font-medium'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            All Staffs
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-1">
              {activeView === 'active' ? 'Showing Active Staff' : 'Total Staff'}
            </h3>
            <p className="text-2xl font-bold text-blue-900">{displayedStaff.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800 mb-1">Active Staff</h3>
            <p className="text-2xl font-bold text-green-900">{activeStaff.length}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-800 mb-1">Resigned Staff</h3>
            <p className="text-2xl font-bold text-red-900">{resignedStaff.length}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  S.No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Staff ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Mobile No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Employment Periods
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedStaff.map((member, index) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {member.staffId}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {member.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{member.age}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{member.gender}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{member.designation}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{member.mobileNo}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="space-y-1 text-xs max-h-20 overflow-y-auto">
                      <div>
                        <span className="font-medium">Period 1:</span> {member.joiningDate}
                        {member.resignedDate && ` - ${member.resignedDate}`}
                      </div>
                      {member.joiningDate2 && (
                        <div>
                          <span className="font-medium">Period 2:</span> {member.joiningDate2}
                          {member.resignedDate2 && ` - ${member.resignedDate2}`}
                        </div>
                      )}
                      {member.joiningDate3 && (
                        <div>
                          <span className="font-medium">Period 3:</span> {member.joiningDate3}
                          {member.resignedDate3 && ` - ${member.resignedDate3}`}
                        </div>
                      )}
                      {member.joiningDate4 && (
                        <div>
                          <span className="font-medium">Period 4:</span> {member.joiningDate4}
                          {member.resignedDate4 && ` - ${member.resignedDate4}`}
                        </div>
                      )}
                      {member.joiningDate5 && (
                        <div>
                          <span className="font-medium">Period 5:</span> {member.joiningDate5}
                          {member.resignedDate5 && ` - ${member.resignedDate5}`}
                        </div>
                      )}
                      {member.joiningDate6 && (
                        <div>
                          <span className="font-medium">Period 6:</span> {member.joiningDate6}
                          {member.resignedDate6 && ` - ${member.resignedDate6}`}
                        </div>
                      )}
                      {member.joiningDate7 && (
                        <div>
                          <span className="font-medium">Period 7:</span> {member.joiningDate7}
                          {member.resignedDate7 && ` - ${member.resignedDate7}`}
                        </div>
                      )}
                      {member.joiningDate8 && (
                        <div>
                          <span className="font-medium">Period 8:</span> {member.joiningDate8}
                          {member.resignedDate8 && ` - ${member.resignedDate8}`}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={getFullAddress(member.address)}>
                      {getFullAddress(member.address) || 'No address provided'}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        member.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {member.createdBy || 'System'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap flex items-center gap-1"
                      >
                        <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                        {userRole === 'User' ? 'View' : 'Edit'}
                      </button>
                      {userRole !== 'User' && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              member.id,
                              member.status === 'Active' ? 'Resigned' : 'Active',
                            )
                          }
                          className={`px-3 py-1 rounded cursor-pointer whitespace-nowrap text-white ${
                            member.status === 'Active'
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {member.status === 'Active' ? 'Mark Resigned' : 'Reactivate'}
                        </button>
                      )}
                      {userRole === 'Admin' && (
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer whitespace-nowrap"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {displayedStaff.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <i className="ri-user-line w-12 h-12 flex items-center justify-center mx-auto mb-2 text-gray-400"></i>
            <p>No {activeView === 'active' ? 'active' : ''} staff members found</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddModal
          onSave={handleAddStaff}
          onClose={() => setShowAddModal(false)}
          currentUser={currentUser}
        />
      )}

      {editingStaff && (
        <EditModal
          staff={editingStaff}
          onSave={handleSave}
          onClose={() => setEditingStaff(null)}
          userRole={userRole}
        />
      )}
    </div>
  );
}

import React, { useState } from 'react';

const Verification = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    idType: '',
    idNumber: '',
    fullName: '',
    dateOfBirth: '',
    address: '',
    idImage: null,
    selfie: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // TODO: Implement verification submission logic
      console.log('Verification submitted:', formData);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-1">
          ID Type
        </label>
        <select
          id="idType"
          name="idType"
          value={formData.idType}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        >
          <option value="">Select ID Type</option>
          <option value="passport">Passport</option>
          <option value="drivers">Driver's License</option>
          <option value="national">National ID</option>
        </select>
      </div>
      <div>
        <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
          ID Number
        </label>
        <input
          type="text"
          id="idNumber"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth
        </label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        ></textarea>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="idImage" className="block text-sm font-medium text-gray-700 mb-1">
          Upload ID Image
        </label>
        <input
          type="file"
          id="idImage"
          name="idImage"
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          accept="image/*"
          required
        />
      </div>
      <div>
        <label htmlFor="selfie" className="block text-sm font-medium text-gray-700 mb-1">
          Upload Selfie
        </label>
        <input
          type="file"
          id="selfie"
          name="selfie"
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          accept="image/*"
          required
        />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Verify Your Identity</h1>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`flex items-center ${num !== 3 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= num ? 'bg-green-600 text-white' : 'bg-gray-200'
                }`}
              >
                {num}
              </div>
              {num !== 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > num ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ml-auto"
              >
                {step === 3 ? 'Submit' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verification; 
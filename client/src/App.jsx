import React, { useState } from 'react';
import { Sprout, CloudRain, Thermometer, FlaskConical, MapPin, Wheat, Calendar } from 'lucide-react';
import InputField from './components/InputField';
import SelectField from './components/SelectField';
import ResultCard from './components/ResultCard';

function App() {
  const [formData, setFormData] = useState({ 
    area: '',
    item: '',
    year: '',
    rainfall: '', 
    pesticides: '', 
    temp: '' 
  });

  // State updated to hold all metrics from the backend
  const [resultData, setResultData] = useState({
    yield: null,
    accuracy: null,
    mae: null,
    graph: null
  });
  
  const [loading, setLoading] = useState(false);

  const areaOptions = [
    { label: 'Albania', value: 'Albania' }, { label: 'Algeria', value: 'Algeria' },
    { label: 'Angola', value: 'Angola' }, { label: 'Argentina', value: 'Argentina' },
    { label: 'Armenia', value: 'Armenia' }, { label: 'Australia', value: 'Australia' },
    { label: 'Austria', value: 'Austria' }, { label: 'Azerbaijan', value: 'Azerbaijan' },
    { label: 'Bahamas', value: 'Bahamas' }, { label: 'Bahrain', value: 'Bahrain' },
    { label: 'Bangladesh', value: 'Bangladesh' }, { label: 'Belarus', value: 'Belarus' },
    { label: 'Belgium', value: 'Belgium' }, { label: 'Botswana', value: 'Botswana' },
    { label: 'Brazil', value: 'Brazil' }, { label: 'Bulgaria', value: 'Bulgaria' },
    { label: 'Burkina Faso', value: 'Burkina Faso' }, { label: 'Burundi', value: 'Burundi' },
    { label: 'Cameroon', value: 'Cameroon' }, { label: 'Canada', value: 'Canada' },
    { label: 'Central African Republic', value: 'Central African Republic' },
    { label: 'Chile', value: 'Chile' }, { label: 'Colombia', value: 'Colombia' },
    { label: 'Croatia', value: 'Croatia' }, { label: 'Denmark', value: 'Denmark' },
    { label: 'Dominican Republic', value: 'Dominican Republic' },
    { label: 'Ecuador', value: 'Ecuador' }, { label: 'Egypt', value: 'Egypt' },
    { label: 'El Salvador', value: 'El Salvador' }, { label: 'Eritrea', value: 'Eritrea' },
    { label: 'Estonia', value: 'Estonia' }, { label: 'Finland', value: 'Finland' },
    { label: 'France', value: 'France' }, { label: 'Germany', value: 'Germany' },
    { label: 'Ghana', value: 'Ghana' }, { label: 'Greece', value: 'Greece' },
    { label: 'Guatemala', value: 'Guatemala' }, { label: 'Guinea', value: 'Guinea' },
    { label: 'Guyana', value: 'Guyana' }, { label: 'Haiti', value: 'Haiti' },
    { label: 'Honduras', value: 'Honduras' }, { label: 'Hungary', value: 'Hungary' },
    { label: 'India', value: 'India' }, { label: 'Indonesia', value: 'Indonesia' },
    { label: 'Iraq', value: 'Iraq' }, { label: 'Ireland', value: 'Ireland' },
    { label: 'Italy', value: 'Italy' }, { label: 'Jamaica', value: 'Jamaica' },
    { label: 'Japan', value: 'Japan' }, { label: 'Kazakhstan', value: 'Kazakhstan' },
    { label: 'Kenya', value: 'Kenya' }, { label: 'Latvia', value: 'Latvia' },
    { label: 'Lebanon', value: 'Lebanon' }, { label: 'Lesotho', value: 'Lesotho' },
    { label: 'Libya', value: 'Libya' }, { label: 'Lithuania', value: 'Lithuania' },
    { label: 'Madagascar', value: 'Madagascar' }, { label: 'Malawi', value: 'Malawi' },
    { label: 'Malaysia', value: 'Malaysia' }, { label: 'Mali', value: 'Mali' },
    { label: 'Mauritania', value: 'Mauritania' }, { label: 'Mauritius', value: 'Mauritius' },
    { label: 'Mexico', value: 'Mexico' }, { label: 'Montenegro', value: 'Montenegro' },
    { label: 'Morocco', value: 'Morocco' }, { label: 'Mozambique', value: 'Mozambique' },
    { label: 'Namibia', value: 'Namibia' }, { label: 'Nepal', value: 'Nepal' },
    { label: 'Netherlands', value: 'Netherlands' }, { label: 'New Zealand', value: 'New Zealand' },
    { label: 'Nicaragua', value: 'Nicaragua' }, { label: 'Niger', value: 'Niger' },
    { label: 'Norway', value: 'Norway' }, { label: 'Pakistan', value: 'Pakistan' },
    { label: 'Papua New Guinea', value: 'Papua New Guinea' }, { label: 'Peru', value: 'Peru' },
    { label: 'Poland', value: 'Poland' }, { label: 'Portugal', value: 'Portugal' },
    { label: 'Qatar', value: 'Qatar' }, { label: 'Romania', value: 'Romania' },
    { label: 'Rwanda', value: 'Rwanda' }, { label: 'Saudi Arabia', value: 'Saudi Arabia' },
    { label: 'Senegal', value: 'Senegal' }, { label: 'Slovenia', value: 'Slovenia' },
    { label: 'South Africa', value: 'South Africa' }, { label: 'Spain', value: 'Spain' },
    { label: 'Sri Lanka', value: 'Sri Lanka' }, { label: 'Sudan', value: 'Sudan' },
    { label: 'Suriname', value: 'Suriname' }, { label: 'Sweden', value: 'Sweden' },
    { label: 'Switzerland', value: 'Switzerland' }, { label: 'Tajikistan', value: 'Tajikistan' },
    { label: 'Thailand', value: 'Thailand' }, { label: 'Tunisia', value: 'Tunisia' },
    { label: 'Turkey', value: 'Turkey' }, { label: 'Uganda', value: 'Uganda' },
    { label: 'Ukraine', value: 'Ukraine' }, { label: 'United Kingdom', value: 'United Kingdom' },
    { label: 'Uruguay', value: 'Uruguay' }, { label: 'Zambia', value: 'Zambia' },
    { label: 'Zimbabwe', value: 'Zimbabwe' }
  ];

  const cropOptions = [
    { label: 'Potatoes', value: 'Potatoes' },
    { label: 'Maize', value: 'Maize' },
    { label: 'Wheat', value: 'Wheat' },
    { label: 'Rice, paddy', value: 'Rice, paddy' },
    { label: 'Soybeans', value: 'Soybeans' }
  ];

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://crop-prediction-model-tfyr.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Server returned an error.');
      }

      const data = await response.json();
      
      // Update state with all the data from Flask
      setResultData({
        yield: data.yield,
        accuracy: data.accuracy,
        mae: data.mae,
        graph: data.graph_image
      });
      
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Cannot connect to backend! Is your Flask server running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Info & Result */}
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-agri font-bold text-sm mb-6 border border-agri/10">
              <Sprout size={16}/> Crop Prediction ML Model
            </div>
            <h1 className="text-5xl font-black leading-tight tracking-tight text-agri-dark">
              Predict Your <br/>
              <span className="text-agri">Harvest</span> Efficiency.
            </h1>
            <p className="text-lg opacity-80 mt-4 max-w-md">
              Using Random Forest models trained on global agricultural data to predict crop yield based on environmental factors.
            </p>
          </div>
          
          <ResultCard 
            result={resultData.yield} 
            accuracy={resultData.accuracy}
            mae={resultData.mae}
            graph={resultData.graph}
            loading={loading} 
          />
        </div>

        {/* Right Side: Input Form */}
        <form onSubmit={handlePredict} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col gap-6">
          <h3 className="text-xl font-bold border-b pb-4 border-gray-100 text-agri-dark">Agricultural Parameters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-agri-dark">
            <SelectField
              label="Area (Country)"
              name="area"
              icon={MapPin}
              value={formData.area}
              onChange={(e) => setFormData({...formData, area: e.target.value})}
              options={areaOptions}
              placeholder="Select a country" 
              required
            />

            <SelectField
              label="Crop Item"
              name="item"
              icon={Wheat}
              value={formData.item}
              onChange={(e)=>setFormData({...formData, item: e.target.value})}
              options={cropOptions}
              placeholder="Select a crop" 
              required
            />

            <InputField 
              label="Year" 
              name="year" 
              type="number"
              icon={Calendar} 
              placeholder="e.g. 2024" 
              value={formData.year}
              onChange={(e)=>setFormData({...formData, year: e.target.value})} 
              required 
            />

            <InputField 
              label="Avg Temp (°C)" 
              name="temp" 
              type="number"
              icon={Thermometer} 
              placeholder="e.g. 24" 
              value={formData.temp}
              onChange={(e)=>setFormData({...formData, temp: e.target.value})} 
              required 
            />
            
            <InputField 
              label="Rainfall (mm/year)" 
              name="rainfall" 
              type="number"
              icon={CloudRain} 
              placeholder="e.g. 1485" 
              value={formData.rainfall}
              onChange={(e)=>setFormData({...formData, rainfall: e.target.value})} 
              required 
            />
            
            <InputField 
              label="Pesticides (tonnes)" 
              name="pesticides" 
              type="number"
              icon={FlaskConical} 
              placeholder="e.g. 121" 
              value={formData.pesticides}
              onChange={(e)=>setFormData({...formData, pesticides: e.target.value})} 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-agri hover:bg-agri-dark text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-agri/30 active:scale-[0.98] disabled:opacity-70 mt-2"
          >
            {loading ? 'Processing...' : 'Run Prediction Model'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default App;
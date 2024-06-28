import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductListView from './components/ProductListView';
import ProductView from './components/ProductView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductListView />} />
        <Route path="/product/:id" element={<ProductView />} />
      </Routes>
    </Router>
  );
}

export default App;

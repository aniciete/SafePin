import React, { useState } from 'react';
import AnimatedDataUpdates from './animated-data-updates';
import { Button } from './button';

/**
 * Examples of AnimatedDataUpdates component usage
 */
export function DataUpdateExamples() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', status: 'active' },
    { id: 2, name: 'Jane Smith', status: 'inactive' },
    { id: 3, name: 'Bob Johnson', status: 'active' }
  ]);
  
  const [stocks, setStocks] = useState([
    { symbol: 'AAPL', price: 150.25, change: 1.25 },
    { symbol: 'MSFT', price: 290.10, change: -0.50 },
    { symbol: 'GOOGL', price: 2750.80, change: 5.20 }
  ]);
  
  // Add a new user
  const addUser = () => {
    const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    setUsers([...users, { 
      id, 
      name: `New User ${id}`, 
      status: 'pending' 
    }]);
  };
  
  // Update a random user's status
  const updateRandomUser = () => {
    if (users.length === 0) return;
    
    const statuses = ['active', 'inactive', 'pending'];
    const randomIndex = Math.floor(Math.random() * users.length);
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    setUsers(users.map((user, index) => 
      index === randomIndex 
        ? { ...user, status: randomStatus }
        : user
    ));
  };
  
  // Remove a random user
  const removeRandomUser = () => {
    if (users.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * users.length);
    setUsers(users.filter((_, index) => index !== randomIndex));
  };
  
  // Update stock prices
  const updateStockPrices = () => {
    setStocks(stocks.map(stock => {
      const change = (Math.random() * 10 - 5).toFixed(2);
      const newPrice = (parseFloat(stock.price) + parseFloat(change)).toFixed(2);
      return {
        ...stock,
        price: parseFloat(newPrice),
        change: parseFloat(change)
      };
    }));
  };
  
  // Get status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100';
    }
  };
  
  // Get price change class
  const getPriceChangeClass = (change) => {
    return change >= 0 
      ? 'text-green-600' 
      : 'text-red-600';
  };
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">User List with Data Updates</h3>
        <div className="flex gap-2 mb-4">
          <Button onClick={addUser}>Add User</Button>
          <Button onClick={updateRandomUser} variant="outline">Update Random</Button>
          <Button onClick={removeRandomUser} variant="outline">Remove Random</Button>
        </div>
        
        <AnimatedDataUpdates
          data={users}
          getKey={user => user.id}
          className="border rounded-md overflow-hidden"
          itemClassName="p-4 border-b last:border-b-0"
          renderItem={user => (
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">ID: {user.id}</div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusClass(user.status)}`}>
                {user.status}
              </div>
            </div>
          )}
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Stock Price Updates</h3>
        <div className="mb-4">
          <Button onClick={updateStockPrices}>Update Prices</Button>
        </div>
        
        <AnimatedDataUpdates
          data={stocks}
          getKey={stock => stock.symbol}
          as="table"
          itemAs="tr"
          className="w-full border-collapse"
          renderItem={stock => (
            <>
              <td className="p-2 border font-medium">{stock.symbol}</td>
              <td className="p-2 border text-right">${stock.price.toFixed(2)}</td>
              <td className={`p-2 border text-right ${getPriceChangeClass(stock.change)}`}>
                {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}
              </td>
            </>
          )}
        >
          <thead>
            <tr>
              <th className="p-2 border bg-gray-50 text-left">Symbol</th>
              <th className="p-2 border bg-gray-50 text-right">Price</th>
              <th className="p-2 border bg-gray-50 text-right">Change</th>
            </tr>
          </thead>
          <tbody>
            {/* AnimatedDataUpdates will render items here */}
          </tbody>
        </AnimatedDataUpdates>
      </div>
    </div>
  );
}
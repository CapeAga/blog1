'use client';

import React from 'react';

export default function TestStyles() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        样式测试页面
      </h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
          红色背景、白色文字、圆角、阴影
        </div>
        
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg">
          绿色背景、白色文字、圆角、阴影
        </div>
        
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
          蓝色背景、白色文字、圆角、阴影
        </div>
        
        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-lg">
          黄色背景、白色文字、圆角、阴影
        </div>
      </div>
      
      <hr className="my-8" />
      
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        内联样式测试
      </h2>
      
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        padding: '1rem',
        backgroundColor: '#f0f0f0',
        borderRadius: '0.5rem'
      }}>
        <div style={{ 
          backgroundColor: 'purple', 
          color: 'white', 
          padding: '1rem',
          borderRadius: '0.5rem'
        }}>
          内联样式 - 紫色
        </div>
        
        <div style={{ 
          backgroundColor: 'orange', 
          color: 'white', 
          padding: '1rem',
          borderRadius: '0.5rem'
        }}>
          内联样式 - 橙色
        </div>
      </div>
    </div>
  );
} 
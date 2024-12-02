'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm, SubmitHandler } from 'react-hook-form'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import toast, { Toaster } from 'react-hot-toast'

type Inputs = {
  importantPoints: [string, string, string]
  interestingPoints: [string, string]
  difficultPoint: string
}

export default function ClassroomFeedback() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://43.156.56.27:8008'
    
  // 确保数据格式正确
  const formattedData = {
    importantPoints: data.importantPoints,
    interestingPoints: data.interestingPoints,
    difficultPoint: data.difficultPoint // 确保这是字符串而不是数组
  };

    console.log('Submitting data:', formattedData);



    const submitPromise = fetch(`${API_URL}/api/submit-feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    }).then(async (response) => {
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || '提交失败');
      }
      return response.json();
    });

    toast.promise(submitPromise, {
      loading: '提交中...',
      success: (data) => {
        reset();
        return data.message || '反馈提交成功！';
      },
      error: (err) => `${err.message || '提交失败，请稍后重试'}`,
    });
  }

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Toaster position="top-center" toastOptions={{
        className: 'dark:bg-gray-800 dark:text-white',
        duration: 3000,
        style: {
          background: isDarkMode ? '#1F2937' : '#fff',
          color: isDarkMode ? '#fff' : '#000',
        },
      }} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
          >
            课堂反馈
          </motion.h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FeedbackQuestion
              question={<span className="text-lg font-bold">1. 本课中你学到的3个最重要的知识点是什么？</span>}
              name="importantPoints"
              register={register}
              errors={errors}
              count={3}
            />
            
            <FeedbackQuestion
              question={<span className="text-lg font-bold">2. 最感兴趣的2个知识点是什么？</span>}
              name="interestingPoints"
              register={register}
              errors={errors}
              count={2}
            />
            
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="text-lg font-bold">3. 最难懂的1个问题是什么？</span>
              </label>
              <textarea
                {...register('difficultPoint', {
                  required: '此字段为必填项',
                  maxLength: { value: 100, message: '不能超过100个字符' }
                })}
                className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden"
                placeholder="请描述你遇到的难点"
                rows={1}
              />
              {errors.difficultPoint && (
                <p className="mt-1 text-xs text-red-500">{errors.difficultPoint.message}</p>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!isValid}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              提交反馈 <ChevronRightIcon className="inline-block w-5 h-5 ml-2" />
            </motion.button>
          </form>
        </div>
      </motion.div>
      
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-4 right-4 bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-lg"
      >
        {isDarkMode ? '🌞' : '🌙'}
      </button>
    </div>
  )
}

function FeedbackQuestion({ question, name, register, errors, count }: {
  question: React.ReactNode
  name: keyof Inputs
  register: any
  errors: any
  count: number
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {question}
      </label>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
<textarea
          {...register(`${name}.${index}` as const, { 
            required: '此字段为必填项', 
            maxLength: { value: 100, message: '不能超过100个字符' } 
          })}
          className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden"
          placeholder={`知识点 ${index + 1}`}
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = target.scrollHeight + 'px';
          }}
        />
          {errors[name] && errors[name][index] && (
            <p className="mt-1 text-xs text-red-500">{errors[name][index].message}</p>
          )}
        </div>
      ))}
    </div>
  )
}


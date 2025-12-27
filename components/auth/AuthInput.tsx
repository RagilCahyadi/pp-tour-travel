'use client'

import { forwardRef, useState } from 'react'
import { Eye, EyeOff, LucideIcon } from 'lucide-react'

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    icon?: LucideIcon
    error?: string
    isPassword?: boolean
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ label, icon: Icon, error, isPassword, className, type, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false)

        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

        return (
            <div className="flex flex-col gap-1.5 w-full">
                <label className="font-inter font-medium text-sm text-gray-700 uppercase tracking-wide">
                    {label}
                </label>
                <div className="relative">
                    {Icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Icon size={18} />
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={inputType}
                        className={`
              w-full h-12 px-4 ${Icon ? 'pl-11' : ''} ${isPassword ? 'pr-11' : ''}
              bg-white border rounded-xl
              font-inter text-sm text-gray-800 placeholder:text-gray-400
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
              ${error
                                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                                : 'border-gray-200 hover:border-gray-300'
                            }
            `}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
                {error && (
                    <p className="text-red-500 text-xs font-inter mt-0.5">{error}</p>
                )}
            </div>
        )
    }
)

AuthInput.displayName = 'AuthInput'

export default AuthInput

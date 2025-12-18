import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Archive, LogOut } from 'lucide-react';

const MobileMenu = ({ isOpen, onClose, scroll, mainAppRef, vaultRef, handleLogout }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
                    />

                    {/* Menu Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="fixed right-0 top-0 bottom-0 w-80 bg-black/95 backdrop-blur-xl border-l border-purple-500/30 z-50 md:hidden"
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
                                <h3 className="text-xl font-bold gradient-text-purple">Menu</h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            {/* Menu Items */}
                            <nav className="flex-1 p-6 space-y-2">
                                <button
                                    onClick={() => {
                                        scroll(mainAppRef);
                                        onClose();
                                    }}
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-purple-500/20 transition-colors text-white"
                                >
                                    <Shield className="w-5 h-5 text-purple-400" />
                                    <span className="font-medium">Create Capsules</span>
                                </button>

                                <button
                                    onClick={() => {
                                        scroll(vaultRef);
                                        onClose();
                                    }}
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-purple-500/20 transition-colors text-white"
                                >
                                    <Archive className="w-5 h-5 text-purple-400" />
                                    <span className="font-medium">My Vault</span>
                                </button>

                                <div className="pt-4 mt-4 border-t border-purple-500/20">
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            onClose();
                                        }}
                                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-colors text-red-400"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium">Logout</span>
                                    </button>
                                </div>
                            </nav>

                            {/* Footer */}
                            <div className="p-6 border-t border-purple-500/20">
                                <p className="text-xs text-gray-400 text-center">
                                    Vault - Unearth the past, Create the future
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;

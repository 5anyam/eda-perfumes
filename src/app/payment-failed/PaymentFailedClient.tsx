"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { XCircle, AlertCircle, RefreshCw, Phone, ArrowLeft } from "lucide-react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const wcOrderId = searchParams.get("wcOrderId");
  const amount = searchParams.get("amount");
  const errorMessage = searchParams.get("error") || "Payment could not be processed";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRetryPayment = () => {
    setRetrying(true);
    // Redirect back to checkout to retry
    setTimeout(() => {
      router.push("/checkout");
    }, 500);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="max-w-2xl mx-auto py-12 px-4">
        
        {/* Error Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-6">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-900 mb-3 tracking-wide">
            Payment Failed
          </h1>
          <p className="text-gray-600 text-sm font-light max-w-md mx-auto">
            We could not process your payment. Do not worry, you can try again.
          </p>
        </div>

        {/* Error Details Card */}
        <div className="border border-red-200 bg-red-50 p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-light text-gray-900 uppercase tracking-widest mb-2">
                Error Details
              </h3>
              <p className="text-sm font-light text-gray-700">
                {errorMessage}
              </p>
              {wcOrderId && (
                <p className="text-xs font-light text-gray-600 mt-2">
                  Order Reference: #{wcOrderId}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Amount Info */}
        {amount && (
          <div className="border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-light text-gray-600 uppercase tracking-widest">
                Payment Amount
              </span>
              <span className="text-xl font-light text-gray-900">
                ₹{parseFloat(amount).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Common Reasons */}
        <div className="border border-gray-200 p-6 mb-6">
          <h3 className="text-sm font-light text-gray-900 uppercase tracking-widest mb-4">
            Common Reasons for Payment Failure
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></span>
              <span className="text-sm font-light text-gray-600">
                Insufficient balance in your account
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></span>
              <span className="text-sm font-light text-gray-600">
                Incorrect card details or expired card
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></span>
              <span className="text-sm font-light text-gray-600">
                Payment limit exceeded
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></span>
              <span className="text-sm font-light text-gray-600">
                Network or connectivity issues
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></span>
              <span className="text-sm font-light text-gray-600">
                Bank declined the transaction
              </span>
            </li>
          </ul>
        </div>

        {/* What to Do Next */}
        <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
          <h3 className="text-sm font-light text-gray-900 uppercase tracking-widest mb-4">
            What You Can Do
          </h3>
          <div className="space-y-3 text-sm font-light text-gray-600">
            <p>• Verify your payment details are correct</p>
            <p>• Ensure you have sufficient balance</p>
            <p>• Try using a different payment method</p>
            <p>• Contact your bank if the issue persists</p>
            <p>• Reach out to our support team for assistance</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <button
            onClick={handleRetryPayment}
            disabled={retrying}
            className={`w-full px-8 py-4 text-xs text-white bg-black hover:bg-gray-800 transition-colors tracking-widest uppercase font-light flex items-center justify-center gap-2 ${
              retrying ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {retrying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Redirecting...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Try Payment Again
              </>
            )}
          </button>

          <Link
            href="/"
            className="w-full block text-center px-8 py-4 text-xs text-black bg-white border border-gray-300 hover:bg-gray-50 transition-colors tracking-widest uppercase font-light"
          >
            <span className="flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </span>
          </Link>
        </div>

        {/* Contact Support */}
        <div className="border border-gray-200 p-6">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-light text-gray-900 uppercase tracking-widest mb-2">
                Need Help?
              </h3>
              <p className="text-xs font-light text-gray-600 mb-3">
                Our support team is available to help you complete your order
              </p>
              <a
                href={`https://api.whatsapp.com/send?phone=919899989803&text=Hi%2C%20I%20need%20help%20with%20failed%20payment${wcOrderId ? `%20for%20order%20%23${wcOrderId}` : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-light text-black hover:text-gray-600 transition-colors uppercase tracking-widest"
              >
                Contact Support on WhatsApp →
              </a>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-xs font-light text-gray-500">
            No amount has been deducted from your account
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailed() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}

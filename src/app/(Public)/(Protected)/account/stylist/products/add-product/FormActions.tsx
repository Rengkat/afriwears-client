// Update FormActions component
import { useRouter } from "next/navigation";

interface Props {
  isSubmitting: boolean;
}

const FormActions = ({ isSubmitting }: Props) => {
  const router = useRouter();

  return (
    <div className="mt-8 flex justify-end gap-3">
      <button
        type="button"
        onClick={() => router.push("/stylist/products")}
        disabled={isSubmitting}
        className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:bg-amber-400 disabled:cursor-not-allowed flex items-center gap-2">
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Product...
          </>
        ) : (
          "Create Product"
        )}
      </button>
    </div>
  );
};

export default FormActions;

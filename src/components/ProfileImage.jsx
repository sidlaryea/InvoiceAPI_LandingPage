// components/ProfileImage.jsx
export default function ProfileImage({ src, onClick }) {
  const fallback = "./user-placeholder.png";
  return (
    <img
      src={src || fallback}
      alt="User"
      className="w-10 h-10 rounded-full object-cover ms-3"
      onClick={onClick}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = fallback;
      }}
    />
  );
}

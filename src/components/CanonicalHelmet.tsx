import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const CanonicalHelmet = () => {
  const { pathname } = useLocation();

  // Create canonical link (always with trailing slash)
  const canonicalUrl = `https://www.toolsx.site${pathname.endsWith("/") ? pathname : pathname + "/"}`;

  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default CanonicalHelmet;

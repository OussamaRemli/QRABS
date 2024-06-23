import { Suspense } from 'react';
import Loader from './Loader';

const Loadable = (Component) => (props) => (
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);
export default Loadable;



// This code utilizes React Suspense to
// manage asynchronous component loading,
// displaying a Loader component as a fallback
// while the main component loads.
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route,
} from 'react-router-dom';

import Root from './routes/root'
import Playlist from './routes/playlist';

// ========================================

const router = createBrowserRouter(createRoutesFromElements([
    <Route
        path='/'
        element={<Root />}
    />,
    <Route
        path='/:playlist_id'
        element={<Playlist />}
    />,
]));

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

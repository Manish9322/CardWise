import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Custom base query that includes authentication token
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers) => {
    if (typeof window !== 'undefined') {
      // Check if we're on an admin route
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      
      // Get the appropriate token
      const token = isAdminRoute 
        ? localStorage.getItem('adminToken') 
        : localStorage.getItem('token');
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    
    return headers;
  },
});

// Wrapper to handle 401 responses
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQueryWithAuth(args, api, extraOptions);
  
  // If we get a 401 Unauthorized response, clear auth and redirect to login
  if (result.error && result.error.status === 401) {
    if (typeof window !== 'undefined') {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      
      if (isAdminRoute) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  }
  
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["DB", "Questions", "Users"],
  endpoints: (builder) => ({
    // DB connection test endpoint
    testDBConnection: builder.query({
      query: () => "/test-db-connection",
      providesTags: ["DB"],
    }),
    // Questions endpoints
    getQuestions: builder.query({
      query: () => "/questions",
      providesTags: ["Questions"],
    }),
    addQuestion: builder.mutation({
      query: (question) => ({
        url: "/questions",
        method: "POST",
        body: question,
      }),
      invalidatesTags: ["Questions"],
    }),
    updateQuestion: builder.mutation({
      query: ({ id, ...question }) => ({
        url: `/questions/${id}`,
        method: "PUT",
        body: question,
      }),
      invalidatesTags: ["Questions"],
    }),
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),
    // Users endpoints
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...user }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useTestDBConnectionQuery,
  useGetQuestionsQuery,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = api;

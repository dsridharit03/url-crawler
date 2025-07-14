import { render, screen, fireEvent, waitFor } from '@testing-library/react';
     import { MemoryRouter } from 'react-router-dom';
     import ResultsTable from '../components/ResultsTable';
     import { getResults } from '../utils/api';
     jest.mock('../utils/api');

     const mockResults: UrlResult[] = [
       {
         id: 1,
         url: 'https://example.com',
         title: 'Example Domain',
         html_version: 'HTML5',
         h1_count: 1,
         h2_count: 0,
         h3_count: 0,
         h4_count: 0,
         h5_count: 0,
         h6_count: 0,
         internal_links: 0,
         external_links: 1,
         broken_links: [],
         has_login_form: false,
         status: 'done',
       },
     ];

     test('renders table with results', async () => {
       (getResults as jest.Mock).mockResolvedValue(mockResults);
       render(<ResultsTable />, { wrapper: MemoryRouter });
       await waitFor(() => {
         expect(screen.getByText('Example Domain')).toBeInTheDocument();
       });
       expect(screen.getByText('Re-run Selected')).toBeInTheDocument();
       expect(screen.getByText('Delete Selected')).toBeInTheDocument();
     });

     test('filters by search term', async () => {
       (getResults as jest.Mock).mockResolvedValue(mockResults);
       render(<ResultsTable />, { wrapper: MemoryRouter });
       const searchInput = screen.getByLabelText('Search results');
       fireEvent.change(searchInput, { target: { value: 'example' } });
       await waitFor(() => {
         expect(screen.getByText('Example Domain')).toBeInTheDocument();
       });
       fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
       await waitFor(() => {
         expect(screen.queryByText('Example Domain')).not.toBeInTheDocument();
       });
     });
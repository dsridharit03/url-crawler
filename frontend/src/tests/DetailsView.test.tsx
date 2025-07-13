import { render, screen } from '@testing-library/react';
import DetailsView from '../components/DetailsView';
import { MemoryRouter } from 'react-router-dom';

test('renders details view', () => {
  render(
    <MemoryRouter initialEntries={['/details/1']}>
      <DetailsView />
    </MemoryRouter>
  );
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});
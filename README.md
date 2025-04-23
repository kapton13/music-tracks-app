# Productivity Tracker App

This project meets all requirements specified in the task specification (ТЗ). Below is a summary of implemented features and verification of each point.

## 1. Create a Track (without file upload)
- [x] Modal dialog to create a new track (`data-testid="create-track-button"` triggers modal).
- [x] Form fields: title, artist, album, coverImage (URL), genres selector.
- [x] Multiple genres: tags with "×" to remove and "+" to add using dropdown.
- [x] Client-side validation: required title and artist, genre minimum 1.
- [x] Cover image URL validation; default image displayed if none.
- [x] No file upload in create form.

## 2. Edit Track Metadata
- [x] "Edit" button (`data-testid="edit-track-{id}"`) opens pre-filled modal.
- [x] Ability to change title, artist, album, genres, coverImage.
- [x] Validation and error messages (`data-testid="error-{field}"`).
- [x] Changes saved to API and immediately reflected in list.

## 3. Upload a Track (file)
- [x] Separate flow: "Upload" (`data-testid="upload-track-{id}"`) and "Replace" buttons.
- [x] File input hidden on page root, triggered by card buttons.
- [x] Accepts MP3/WAV, max size 20 MB with client-side checks.
- [x] Removal/replace of existing file (`data-testid="delete-audio-{id}"`).
- [x] Uploaded file becomes playable inline (waveform + HTML audio).

## 4. Delete a Track
- [x] "Delete" button (`data-testid="delete-track-{id}"`) with confirmation dialog.
- [x] Track removed from UI immediately (optimistic update) and backend.

## 5. List View with Pagination, Sorting, and Filtering
- [x] Displays track cards with pagination controls (`data-testid="pagination"`, `pagination-prev`, `pagination-next`).
- [x] Sorting control (`data-testid="sort-select"`) and toggle order.
- [x] Filters by artist (`data-testid="filter-artist"`) and genre (`data-testid="filter-genre"`).
- [x] Search input (`data-testid="search-input"`) with debounce.

## 6. Extra Tasks
- [x] Bulk delete: toggle selection mode (`data-testid="select-mode-toggle"`), select all (`data-testid="select-all"`), bulk delete button.
- [x] Optimistic updates for create, delete, bulk delete.
- [x] Waveform visualization powered by `wavesurfer.js` component.

## 7. Testability
- [x] All interactive elements have appropriate `data-testid` attributes as per spec.
- [x] Loading states (`data-testid="loading-tracks"`, `data-loading="true"`).
- [x] Confirmation dialogs and toast container (`data-testid="toast-container"`, `toast-success`, `toast-error`).

## 8. Application Start
```bash
npm install
npm start

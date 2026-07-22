import axios from 'axios';
import * as d3 from 'd3';

const api = axios.create({
  baseURL: 'https://digifolk.usal.es/api/',
});


// items = metadata
export const getListItems = async () => {
  try {
    const response = await api.get('getListItems'); // Adjust endpoint as needed
    return response.data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};

export const getItemById = async (id) => {
  try {
    const response = await api.get('getItemById', {
      params: { id }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching item with id ${id}:`, error);
    throw error;
  }
};

// get music pieces
export const getListOfPieces = async (local = false) => {
  try {
    if (local) {
      const response = await d3.json('data/music_pieces.json', function(error, data) {
        console.log(data);
        if (error) {
          console.error("Error loading local JSON:", error);
          throw error;
        }
        return data;
      });
      console.log(response);
      return response;
    }

    const response = await api.get('getListOfPieces'); // Adjust endpoint as needed
    return response.data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};

export const getPieceById = async (id) => {
  try {
    const response = await api.get('getPiece', {
      params: { id }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching piece with id ${id}:`, error);
    throw error;
  }
};

// get music pieces with details (for testing). Need an endpoint for this
export const getListOfPiecesWDetails = async (local = true) => {
  try {
    if (local) {
      const response = await d3.json('data/music_pieces_details_filtered.json');
      return response;
    }

    console.error("Need an endpoint for fetching pieces with details");
    return []; // Placeholder until we have an endpoint for this

    //const response = await api.get('getListOfPieces'); // Need endpoint for this
    //return response.data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};
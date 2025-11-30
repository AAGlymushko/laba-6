export const canvas = document.getElementById("root");

export const ctx = canvas.getContext("2d");

export const WORLD_WIDTH = 5000;

export const WORLD_HEIGHT = 1250;

export const CAMERA_OFFSET_X = 400;

export const CAMERA_OFFSET_Y = 300;

export const [SIZE_X, SIZE_Y] = [canvas.width = window.innerWidth - 50, canvas.height = window.innerHeight - 50];

export const STEP_ALONG_Y = 5;

export const STEP_FALL = 30;

export const STEP_ALONG_X = 5;

export const MAX_Y = canvas.height;

export const MIN_Y = 0;

export const MAX_X = canvas.width;

export const MIN_X = 0;

export const MAX_ADD_SPEED = 10;

export const SQUARE = [ window.innerWidth, window.innerHeight ]

export const START_SPEED_JUMP = 50;

export const READUCTION_FACTOR = 15;
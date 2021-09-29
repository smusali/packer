/** External Dependencies */
import {Request, Response} from 'express';

/**
 * Provides Information about the Service
 * @param {Request} req
 * @param {Response} res
 */
export const info = (req: Request, res: Response): void => {
  res.status(200).send([
    '<i>Welcome to Mobiquity Packaging Challenge!</i><br>',
    'Available Routes:',
    ' - <b>POST /packages</b>: Creates a package',
    ' - <b>GET /packages/example</b>: Displays the example calculation',
    ' - <b>GET /info</b>: Displays the details about the API',
    ' - <b>GET /packages</b>: Lists the Packages',
    ' - <b>DELETE /packages/:id</b>: Deletes the Package',
    ' - <b>GET /packages/:id</b>: Retrieves the Package',
    ' - <b>PUT /packages/:id</b>: Updates the Package',
  ].join('<br>'));
};

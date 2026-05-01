import { Router, type IRouter } from "express";
import healthRouter from "./health";
import { registerDelbarRoutes } from "./routes";

const router: IRouter = Router();

router.use(healthRouter);
registerDelbarRoutes(router);

export default router;

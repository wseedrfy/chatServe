import { Module } from "@nestjs/common";
import { RecommendationController } from "./recommendation.controller";

@Module({
  providers: [RecommendationController]
})

export class RecommendationModule { }
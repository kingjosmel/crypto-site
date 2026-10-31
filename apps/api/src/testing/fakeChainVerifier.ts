import type { ChainVerifier, PaymentObservationInput } from "../services/paymentTypes.js";
export class FakeChainVerifier implements ChainVerifier {
  readonly requiredFinality = 1;
  private observations: PaymentObservationInput[] = [];
  constructor(private readonly network = "fake") {}
  async createPaymentTarget(order: unknown, asset: string) { void order; void asset; return { network: this.network, depositAddress: "fake-deposit-address" }; }
  async findPayment(payment: unknown) { void payment; return this.observations; }
  setObservations(observations: PaymentObservationInput[]) { this.observations = observations; }
}

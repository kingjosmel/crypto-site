export class FakeChainVerifier {
    network;
    requiredFinality = 1;
    observations = [];
    constructor(network = "fake") {
        this.network = network;
    }
    async createPaymentTarget(order, asset) { void order; void asset; return { network: this.network, depositAddress: "fake-deposit-address" }; }
    async findPayment(payment) { void payment; return this.observations; }
    setObservations(observations) { this.observations = observations; }
}

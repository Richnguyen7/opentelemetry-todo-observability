const { NodeSDK } = require("@opentelemetry/sdk-node");
const { resourceFromAttributes } = require("@opentelemetry/resources");
const { ATTR_SERVICE_NAME } = require("@opentelemetry/semantic-conventions");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");

const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const { OTLPMetricExporter } = require("@opentelemetry/exporter-metrics-otlp-http");
const {
  PeriodicExportingMetricReader,
} = require("@opentelemetry/sdk-metrics");

// Create Jaeger OTLP exporters
const traceExporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
});

const metricExporter = new OTLPMetricExporter({
  url: "http://localhost:4318/v1/metrics",
});

// Configure the SDK
const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "todo-service",
  }),
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start the OpenTelemetry SDK
sdk.start();

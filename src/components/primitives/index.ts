/**
 * Primitives — UI Revolution Plan §2.2 Phase 1 Core Primitives
 *
 * Barrel export for all primitive components.
 *
 * Usage:
 *   import { Button, Card, CardHeader, Input, Heading, Text, Container, Section, Grid, Stack } from "@/components/primitives";
 *
 * These are ADDITIVE — they coexist with existing ui/ components.
 * New code should use these; existing code can be migrated incrementally.
 */

export {
  Button,
  buttonVariants,
  type ButtonProps,
} from "./button";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
  CardAction,
  cardVariants,
  type CardProps,
} from "./card";

export {
  Input,
  Textarea,
  InputGroup,
  inputVariants,
  type InputProps,
  type TextareaProps,
  type InputGroupProps,
} from "./input";

export {
  Heading,
  Text,
  Label,
  type HeadingProps,
  type TextProps,
  type LabelProps,
} from "./typography";

export {
  Container,
  Section,
  Grid,
  Stack,
  type ContainerProps,
  type SectionProps,
  type GridProps,
  type StackProps,
} from "./layout";

export {
  Seal,
  type SealProps,
} from "./seal";

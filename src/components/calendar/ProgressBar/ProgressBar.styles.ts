import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
  },
  percentText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  completionMessage: {
    marginTop: 8,
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '600',
    textAlign: 'center',
  },
  startMessage: {
    marginTop: 8,
    fontSize: 12,
    color: '#95A5A6',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  miniProgressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

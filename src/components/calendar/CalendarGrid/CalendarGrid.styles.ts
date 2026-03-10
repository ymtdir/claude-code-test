import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  dayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minHeight: 70,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  rokuyouText: {
    fontSize: 10,
    color: '#95A5A6',
    marginTop: 2,
  },
  holidayText: {
    fontSize: 9,
    color: '#FF6B6B',
    marginTop: 1,
    fontWeight: '600',
  },
  taskBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
